import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import { AuthUser } from '../../../types/express';

export class CompanyController {
  /**
   * Generate a unique company code based on company name
   */
  private async generateUniqueCompanyCode(name: string): Promise<string> {
    // Extract letters and numbers, convert to uppercase
    const cleanName = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 4); // Take first 4 characters
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      // Generate a random 3-character suffix
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      const code = `${cleanName}${randomSuffix}`;
      
      // Check if this code already exists
      const existingCompany = await prisma.company.findUnique({
        where: { code }
      });
      
      if (!existingCompany) {
        return code;
      }
      
      attempts++;
    }
    
    // If we couldn't generate a unique code after max attempts, use timestamp
    const timestamp = Date.now().toString().slice(-3);
    return `${cleanName}${timestamp}`;
  }

  /**
   * Create a new company (SuperAdmin only)
   */
  async createCompany(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      // Only SuperAdmin can create companies
      if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. SuperAdmin access required.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Company name is required',
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }

      // Generate unique company code automatically
      const code = await this.generateUniqueCompanyCode(name);

      // Create the company
      const company = await prisma.company.create({
        data: {
          name: name.trim(),
          code: code,
          isActive: true
        }
      });

      console.log(`✅ SuperAdmin ${user.email} created company: ${company.name} (${company.code})`);

      return res.status(201).json({
        success: true,
        message: 'Company created successfully',
        company: {
          id: company.id,
          name: company.name,
          code: company.code,
          isActive: company.isActive,
          createdAt: company.createdAt
        }
      });
    } catch (error: any) {
      console.error('Error creating company:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create company',
        error: error.message
      });
    }
  }

  /**
   * Update company (SuperAdmin only)
   */
  async updateCompany(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      // Only SuperAdmin can update companies
      if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. SuperAdmin access required.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      const { id } = req.params;
      const { name, code, isActive } = req.body;

      const companyId = parseInt(id);
      if (isNaN(companyId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid company ID',
          code: 'INVALID_COMPANY_ID'
        });
      }

      // Check if company exists
      const existingCompany = await prisma.company.findUnique({
        where: { id: companyId }
      });

      if (!existingCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
          code: 'COMPANY_NOT_FOUND'
        });
      }

      // If code is being changed, check for conflicts
      if (code && code.toUpperCase() !== existingCompany.code) {
        const codeConflict = await prisma.company.findUnique({
          where: { code: code.toUpperCase() }
        });

        if (codeConflict) {
          return res.status(400).json({
            success: false,
            message: 'Company with this code already exists',
            code: 'COMPANY_CODE_EXISTS'
          });
        }
      }

      // Update the company
      const updatedCompany = await prisma.company.update({
        where: { id: companyId },
        data: {
          ...(name && { name: name.trim() }),
          ...(code && { code: code.toUpperCase().trim() }),
          ...(typeof isActive === 'boolean' && { isActive })
        }
      });

      console.log(`✅ SuperAdmin ${user.email} updated company: ${updatedCompany.name}`);

      return res.json({
        success: true,
        message: 'Company updated successfully',
        company: {
          id: updatedCompany.id,
          name: updatedCompany.name,
          code: updatedCompany.code,
          isActive: updatedCompany.isActive,
          updatedAt: updatedCompany.updatedAt
        }
      });
    } catch (error: any) {
      console.error('Error updating company:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update company',
        error: error.message
      });
    }
  }

  /**
   * Get all companies (SuperAdmin only)
   * Used for dropdown selection when creating users
   */
  async getAllCompanies(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      // Only SuperAdmin can fetch all companies
      if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. SuperAdmin access required.',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

 const companies = await prisma.company.findMany({
  where: {
    // isActive: true
  },
  select: {
    id: true,
    name: true,
    code: true,
    isActive: true,
    // Director + Admin user include karo
    users: {
      where: {
      role: "ADMIN",
      OR: [
      { designation: "Director" },
      { designation: "DIRECTOR" }
    ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        designation: true,
        role: true
      }
    },

    _count: {
      select: {
        users: true,
        employees: true
      }
    }
  },
  orderBy: {
    name: 'asc'
  }
});

return res.json({
  success: true,
  companies: companies.map(company => ({
    id: company.id,
    name: company.name,
    code: company.code,
    isActive: company.isActive,
    userCount: company._count.users,
    employeeCount: company._count.employees,

    // Agar sirf ek Director/Admin chahiye to first element le sakte ho
    directorAdmin: company.users.length > 0 ? company.users[0] : null
  }))
});
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch companies',
        error: error.message
      });
    }
  }

  /**
   * Get current user's company details
   * Used for Admin/Manager to see their company info
   */
  async getCurrentUserCompany(req: Request, res: Response) {
    try {
      const user = req.user as AuthUser;

      if (!user.companyId) {
        return res.status(404).json({
          success: false,
          message: 'User is not associated with any company',
          code: 'NO_COMPANY'
        });
      }

      const company = await prisma.company.findUnique({
        where: {
          id: user.companyId
        },
        select: {
          id: true,
          name: true,
          code: true,
          _count: {
            select: {
              users: true,
              employees: true,
              departments: true
            }
          }
        }
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
          code: 'COMPANY_NOT_FOUND'
        });
      }

      return res.json({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          code: company.code,
          userCount: company._count.users,
          employeeCount: company._count.employees,
          departmentCount: company._count.departments
        }
      });
    } catch (error: any) {
      console.error('Error fetching user company:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch company details',
        error: error.message
      });
    }
  }
}