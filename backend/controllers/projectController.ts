import { Request, Response } from 'express';
import { Repository } from '../config/store';
import { uploadImageToCloudinary, deleteFromCloudinary } from '../config/cloudinary';

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// PUBLIC API: Get only published projects
export const getPublicProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Repository.getPublicProjects();
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    console.error('Error fetching public projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio projects.',
    });
  }
};

// ADMIN API: Get all projects with filtering
export const getAdminProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, category } = req.query as {
      search?: string;
      status?: string;
      category?: string;
    };

    const projects = await Repository.getAllProjects({ search, status, category });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error: any) {
    console.error('Error fetching admin projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin projects list.',
    });
  }
};

// ADMIN API: Get single project by ID
export const getAdminProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Repository.getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project details.',
    });
  }
};

// ADMIN API: Create new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      slug: customSlug,
      shortDescription,
      description,
      technologies,
      githubUrl,
      liveUrl,
      category,
      featured,
      published,
      imageUrl,
      accentColor,
      metrics,
    } = req.body;

    const finalShortDesc = shortDescription?.trim() || description?.slice(0, 160)?.trim() || '';
    const finalDesc = description?.trim() || shortDescription?.trim() || '';

    if (!title || !title.trim() || !finalDesc) {
      res.status(400).json({
        success: false,
        message: 'Project Title and Description are required.',
      });
      return;
    }

    const finalSlug = customSlug && customSlug.trim() ? slugify(customSlug) : slugify(title);

    // Check slug uniqueness
    const existing = await Repository.getProjectBySlug(finalSlug);
    if (existing) {
      res.status(400).json({
        success: false,
        message: `A project with slug "${finalSlug}" already exists. Please choose a different title or slug.`,
      });
      return;
    }

    // Process technologies array
    let parsedTech: string[] = [];
    if (Array.isArray(technologies)) {
      parsedTech = technologies;
    } else if (typeof technologies === 'string') {
      try {
        parsedTech = JSON.parse(technologies);
      } catch {
        parsedTech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    let finalImageUrl = imageUrl || '';
    let imagePublicId = '';

    // If file uploaded via Multer
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'portfolio/projects'
      );
      finalImageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const newProject = await Repository.createProject({
      title: title.trim(),
      slug: finalSlug,
      shortDescription: finalShortDesc,
      description: finalDesc,
      image: finalImageUrl,
      publicId: imagePublicId,
      technologies: parsedTech,
      githubUrl: githubUrl ? githubUrl.trim() : '',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      category: category ? category.trim() : 'Full Stack',
      featured: featured === true || featured === 'true',
      published: published === true || published === 'true',
      accentColor: accentColor || '#06B6D4',
      metrics: metrics || '',
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: newProject,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create project.',
    });
  }
};

// ADMIN API: Update existing project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existingProject = await Repository.getProjectById(id);

    if (!existingProject) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    const {
      title,
      slug: customSlug,
      shortDescription,
      description,
      technologies,
      githubUrl,
      liveUrl,
      category,
      featured,
      published,
      imageUrl,
      accentColor,
      metrics,
    } = req.body;

    const updates: any = {};

    if (title !== undefined) updates.title = title.trim();
    if (customSlug !== undefined && customSlug.trim()) {
      const newSlug = slugify(customSlug);
      if (newSlug !== existingProject.slug) {
        const slugExists = await Repository.getProjectBySlug(newSlug);
        if (slugExists && (slugExists._id?.toString() !== id && slugExists.id !== id)) {
          res.status(400).json({
            success: false,
            message: `A project with slug "${newSlug}" already exists.`,
          });
          return;
        }
        updates.slug = newSlug;
      }
    }
    if (shortDescription !== undefined) updates.shortDescription = shortDescription.trim();
    if (description !== undefined) updates.description = description.trim();
    if (githubUrl !== undefined) updates.githubUrl = githubUrl.trim();
    if (liveUrl !== undefined) updates.liveUrl = liveUrl.trim();
    if (category !== undefined) updates.category = category.trim();
    if (featured !== undefined) updates.featured = featured === true || featured === 'true';
    if (published !== undefined) updates.published = published === true || published === 'true';
    if (accentColor !== undefined) updates.accentColor = accentColor;
    if (metrics !== undefined) updates.metrics = metrics;

    if (technologies !== undefined) {
      if (Array.isArray(technologies)) {
        updates.technologies = technologies;
      } else if (typeof technologies === 'string') {
        try {
          updates.technologies = JSON.parse(technologies);
        } catch {
          updates.technologies = technologies.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
    }

    // Handle new image upload
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'portfolio/projects'
      );

      // Clean up previous Cloudinary asset if exists
      if (existingProject.publicId) {
        await deleteFromCloudinary(existingProject.publicId, 'image');
      }

      updates.image = uploadResult.secure_url;
      updates.publicId = uploadResult.public_id;
    } else if (imageUrl !== undefined) {
      updates.image = imageUrl;
    }

    const updated = await Repository.updateProject(id, updates);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update project.',
    });
  }
};

// ADMIN API: Delete project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Repository.getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    // Delete image from Cloudinary if applicable
    if (project.publicId) {
      await deleteFromCloudinary(project.publicId, 'image');
    }

    await Repository.deleteProject(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project.',
    });
  }
};

// ADMIN API: Toggle or set publish status
export const togglePublishProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Repository.getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
      return;
    }

    const newStatus = typeof req.body.published === 'boolean' ? req.body.published : !project.published;
    const updated = await Repository.updateProject(id, { published: newStatus });

    res.status(200).json({
      success: true,
      message: `Project ${newStatus ? 'published' : 'moved to draft'} successfully.`,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle project publish status.',
    });
  }
};

// ADMIN API: Dashboard summary metrics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const allProjects = await Repository.getAllProjects();
    const published = allProjects.filter((p) => p.published).length;
    const draft = allProjects.filter((p) => !p.published).length;
    const featured = allProjects.filter((p) => p.featured).length;
    const resume = await Repository.getLatestResume();

    res.status(200).json({
      success: true,
      stats: {
        totalProjects: allProjects.length,
        publishedProjects: published,
        draftProjects: draft,
        featuredProjects: featured,
        hasResume: Boolean(resume && resume.fileUrl),
        resumeInfo: resume ? {
          fileName: resume.fileName,
          updatedAt: resume.updatedAt || resume.createdAt,
          fileUrl: resume.fileUrl,
        } : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate dashboard statistics.',
    });
  }
};
