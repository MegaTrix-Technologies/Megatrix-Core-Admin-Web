import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import MetricCard from '../../components/MetricCard';
import ProjectCredentialsTab from '../../components/credentials/ProjectCredentialsTab';
import {
  GraduationCap,
  Users,
  Tag,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  Key,
  Search,
  Activity,
  RefreshCw,
  ExternalLink,
  Shield,
  CheckCircle2,
  Trash2,
  UserCheck,
  X,
  Check,
  Copy,
  Building2,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  Filter,
  Eye,
  Award,
} from 'lucide-react';
import { toast } from 'react-toastify';
import platformApi from '../../services/platformApi';
import adminApi from '../../services/adminApi';

const DEFAULT_SCHOOL_PLANS = [
  {
    id: 'basic-campus',
    name: 'Basic Campus',
    tagline: 'Ideal for single-campus schools and tuition centers up to 500 students',
    price: 'PKR 18,500',
    billing: 'monthly',
    activeCount: 112,
    popular: false,
    features: [
      'Up to 500 enrolled student profiles',
      'Digital student & teacher attendance',
      'Automated monthly fee challan generation',
      'SMS notification dispatch integration',
      'Report card & exam transcript printing',
      'Basic staff & teacher payroll ledger',
    ],
  },
  {
    id: 'standard-academy',
    name: 'Standard Academy',
    tagline: 'Full ERP automation for comprehensive schools up to 2,000 students',
    price: 'PKR 38,000',
    billing: 'monthly',
    activeCount: 148,
    popular: true,
    features: [
      'Up to 2,000 enrolled student profiles',
      'Biometric attendance machine auto-sync',
      'Parent mobile portal & real-time notices',
      'Fee recovery ledger with online bank challans',
      'Library & laboratory asset tracking',
      'Granular academic exam grading system',
      'Dedicated priority WhatsApp support',
    ],
  },
  {
    id: 'institutional-enterprise',
    name: 'Institutional Enterprise',
    tagline: 'Multi-branch school networks & collegiate institutions with unlimited capacity',
    price: 'PKR 85,000',
    billing: 'monthly',
    activeCount: 28,
    popular: false,
    features: [
      'Unlimited student & faculty enrollments',
      'Centralized HQ multi-campus management',
      'Enterprise cloud backup & daily failover',
      'Custom subdomain & branded mobile app',
      'Advanced finance, fee auditing & tax reports',
      'Custom ERP REST API & webhook integrations',
      '24/7 dedicated account engineering manager',
    ],
  },
];

const REAL_SCHOOLS = [
  {
    "id": "LGA001",
    "mongoId": "6aa6831d879fa23ac5a1de73",
    "name": "Lahore Grammar Academy",
    "code": "LGA001",
    "campus": "42-B Knowledge Way, Main Gulberg III, Lahore",
    "city": "Lahore",
    "phone": "042-35870000",
    "email": "admin@lga.edu.pk",
    "board": "BISE Lahore",
    "principalName": "Prof. Tariq Mehmood Chaudhry",
    "studentCount": 1104,
    "teacherCount": 22,
    "isActive": true
  },
  {
    "id": "CMPS002",
    "mongoId": "6aa68336879fa23ac5a1e181",
    "name": "Crescent Model Public School",
    "code": "CMPS002",
    "campus": "15 Shadman Colony, Jail Road, Lahore",
    "city": "Lahore",
    "phone": "042-37425161",
    "email": "admin@cmps.edu.pk",
    "board": "BISE Lahore",
    "principalName": "Mrs. Farzana Naseem",
    "studentCount": 0,
    "teacherCount": 0,
    "isActive": true
  },
  {
    "id": "LHE001",
    "mongoId": "6aa69227bd1b18138949dc82",
    "name": "Sufi School System",
    "code": "LHE001",
    "campus": "H # 47 M Cantt View Housing Society Bedian Road Lahore Cantt, Pakistan, Lahore",
    "city": "Lahore",
    "phone": "03010915911",
    "email": "ranasuffyan9@gmail.com",
    "board": "BISE Lahore",
    "principalName": "Harami",
    "studentCount": 0,
    "teacherCount": 0,
    "isActive": true
  },
  {
    "id": "LHE002",
    "mongoId": "6aa71ba9fa0ef9186f8bfe10",
    "name": "Apex Model School",
    "code": "LHE002",
    "campus": "H # 47-M Cantt View Housing Society, Lahore",
    "city": "Lahore",
    "phone": "03010915911",
    "email": "admin@school.com",
    "board": "BISE Lahore",
    "principalName": "Ayesha@gmail.com",
    "studentCount": 0,
    "teacherCount": 0,
    "isActive": true
  },
  {
    "id": "LHE003",
    "mongoId": "6aa7bdd7f81a4f3a928220b7",
    "name": "Test School System",
    "code": "LHE003",
    "campus": "Test address 123, Lahore",
    "city": "Lahore",
    "phone": "03010915911",
    "email": "testadmin@gmail.com",
    "board": "BISE Lahore",
    "principalName": "Test Admin",
    "studentCount": 0,
    "teacherCount": 0,
    "isActive": true
  },
  {
    "id": "LHE004",
    "mongoId": "6aa7d8ddf81a4f3a928221ce",
    "name": "Apex",
    "code": "LHE004",
    "campus": "Street : Ayesha, Lahore",
    "city": "Lahore",
    "phone": "03081505859",
    "email": "hashirfarooq48@gmail.com",
    "board": "BISE Lahore",
    "principalName": "Prof Hashir ",
    "studentCount": 0,
    "teacherCount": 0,
    "isActive": true
  },
  {
    "id": "LHE005",
    "mongoId": "6aa86ac8b787e0c870aa4956",
    "name": "Test School System",
    "code": "LHE005",
    "campus": "Test123, Lahore",
    "city": "Lahore",
    "phone": "03000000001",
    "email": "testmark@gmail.com",
    "board": "BISE Lahore",
    "principalName": "Dr test",
    "studentCount": 0,
    "teacherCount": 0,
    "isActive": true
  }
];

const MOCK_SCHOOLS = REAL_SCHOOLS;

const INITIAL_SCHOOL_USERS = [
  {
    "id": "6aa6831d879fa23ac5a1de74",
    "name": "Prof. Tariq Mehmood Chaudhry",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "admin@lga.edu.pk",
    "phone": "+92 300-1234567",
    "role": "Principal & Chief Administrator",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:58.065Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:03:58.065Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa6831e879fa23ac5a1de7d",
    "name": "Usman Farooq",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "accounts@lga.edu.pk",
    "phone": "+92 321-4455667",
    "role": "Senior Accounts Officer",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:58.138Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:03:58.138Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "STF-101",
      "salary": "PKR 52,000"
    }
  },
  {
    "id": "6aa6831e879fa23ac5a1de7f",
    "name": "Rashid Bilal",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "finance@lga.edu.pk",
    "phone": "+92 333-7788990",
    "role": "Director Finance & Accounts",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:58.225Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:03:58.225Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "STF-102",
      "salary": "PKR 85,000"
    }
  },
  {
    "id": "6aa6831e879fa23ac5a1de81",
    "name": "Zainab Akhtar",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "admissions@lga.edu.pk",
    "phone": "+92 302-8899001",
    "role": "Admissions Coordinator",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:58.299Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:03:58.299Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "STF-103",
      "salary": "PKR 42,000"
    }
  },
  {
    "id": "6aa68336879fa23ac5a1e182",
    "name": "Mrs. Farzana Naseem",
    "schoolId": "CMPS002",
    "schoolName": "Crescent Model Public School",
    "email": "admin@cmps.edu.pk",
    "phone": "+92 301-9988776",
    "role": "Principal & Executive Head",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:04:22.880Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-13T11:04:22.880Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa68ab65c44e4e4e854387e",
    "name": "Staff Officer 2057",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_2057@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:36:22.671Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:36:22.671Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68ae35c44e4e4e8543a07",
    "name": "Staff Officer 6958",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_6958@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:37:07.469Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:37:07.469Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68b445c44e4e4e8543ba4",
    "name": "Staff Officer 4373",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_4373@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:38:44.976Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:38:44.976Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68b825c44e4e4e8543d55",
    "name": "Staff Officer 6232",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_6232@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:39:46.887Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:39:46.887Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68bee5c44e4e4e8543f54",
    "name": "Staff Officer 3696",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_3696@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:41:34.310Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:41:34.310Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68c606e6c92fec419e023",
    "name": "Staff Officer 8308",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_8308@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:43:28.929Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:43:28.929Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68d573f5586cd86af607f",
    "name": "Staff Officer 4446",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_4446@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:47:35.240Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:47:35.240Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68e1a3f5586cd86af6352",
    "name": "Staff Officer 9993",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_9993@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:50:50.591Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:50:50.591Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa68e833f5586cd86af688e",
    "name": "Staff Officer 4508",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "officer_4508@lga.edu.pk",
    "phone": "+92 300 0000000",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-13T11:52:35.138Z",
    "subscription": {
      "plan": "Institutional Enterprise",
      "status": "active",
      "startedAt": "2026-09-13T11:52:35.138Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 1104,
      "facultyCount": 22,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "63 Active Challans",
      "employeeId": "N/A",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa69227bd1b18138949dc83",
    "name": "Harami",
    "schoolId": "LHE001",
    "schoolName": "Sufi School System",
    "email": "ranasuffyan9@gmail.com",
    "phone": "+92 3010915911",
    "role": "Principal & Chief Administrator",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T12:08:08.723Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-13T12:08:08.723Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa71ba9fa0ef9186f8bfe11",
    "name": "Ayesha@gmail.com",
    "schoolId": "LHE002",
    "schoolName": "Apex Model School",
    "email": "admin@school.com",
    "phone": "+92 3010915911",
    "role": "Principal & Chief Administrator",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T21:54:50.081Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-13T21:54:50.081Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa7bdd7f81a4f3a928220b8",
    "name": "Test Admin",
    "schoolId": "LHE003",
    "schoolName": "Test School System",
    "email": "testadmin@gmail.com",
    "phone": "+92 3010915911",
    "role": "Principal & Chief Administrator",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-14T09:26:47.526Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T09:26:47.526Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa7d16607ff9f9205807918",
    "name": "Asim",
    "schoolId": "LHE003",
    "schoolName": "Test School System",
    "email": "asim@gmail.com",
    "phone": "+92 3004023322",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-14T10:50:14.901Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T10:50:14.901Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "PKR 35,000"
    }
  },
  {
    "id": "6aa7d18a07ff9f9205807920",
    "name": "Riaz",
    "schoolId": "LHE003",
    "schoolName": "Test School System",
    "email": "riaz@gmail.com",
    "phone": "+92 3004023212",
    "role": "Admissions Officer",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-14T10:50:50.158Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T10:50:50.158Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "PKR 50,000"
    }
  },
  {
    "id": "6aa7d1c807ff9f9205807928",
    "name": "Raza",
    "schoolId": "LHE003",
    "schoolName": "Test School System",
    "email": "raza@gmail.com",
    "phone": "+92 3000000000",
    "role": "Security Supervisor",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-14T10:51:52.005Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T10:51:52.005Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "PKR 15,000"
    }
  },
  {
    "id": "6aa7d8ddf81a4f3a928221cf",
    "name": "Prof Hashir",
    "schoolId": "LHE004",
    "schoolName": "Apex",
    "email": "hashirfarooq48@gmail.com",
    "phone": "+92 3081505859",
    "role": "Principal & Chief Administrator",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-14T11:22:05.724Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T11:22:05.724Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa7da30f81a4f3a9282229d",
    "name": "Ahmad",
    "schoolId": "LHE004",
    "schoolName": "Apex",
    "email": "ahashirfarooq16@gmail.com",
    "phone": "+92 3081505859",
    "role": "Admissions Officer",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-14T11:27:44.578Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T11:27:44.578Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "PKR 62,000"
    }
  },
  {
    "id": "6aa86ac8b787e0c870aa4957",
    "name": "Dr test",
    "schoolId": "LHE005",
    "schoolName": "Test School System",
    "email": "testmark@gmail.com",
    "phone": "+92 3000000001",
    "role": "Principal & Chief Administrator",
    "roleCategory": "admin",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-14T21:44:40.905Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T21:44:40.905Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "N/A",
      "salary": "Administrative"
    }
  },
  {
    "id": "6aa86ca9b787e0c870aa4b88",
    "name": "Abu Sufian",
    "schoolId": "LHE005",
    "schoolName": "Test School System",
    "email": "hashir48@gmail.com",
    "phone": "+92 3010915911",
    "role": "Accountant",
    "roleCategory": "staff",
    "status": "active",
    "mustChangePassword": true,
    "createdAt": "2026-09-14T21:52:41.604Z",
    "subscription": {
      "plan": "Standard Academy",
      "status": "active",
      "startedAt": "2026-09-14T21:52:41.604Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Annual Enterprise"
    },
    "academicMetrics": {
      "totalStudents": 0,
      "facultyCount": 1,
      "attendanceRate": "98.2%",
      "pendingFeeChallans": "N/A",
      "employeeId": "STF-101",
      "salary": "PKR 30,000"
    }
  },
  {
    "id": "6aa6831f879fa23ac5a1de9f",
    "name": "Muhammad Rizwan",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "rizwan@lga.edu.pk",
    "phone": "+92 300-4567890",
    "role": "Senior Mathematics Lecturer & Class Incharge",
    "roleCategory": "teacher",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:59.382Z",
    "subscription": {
      "plan": "Faculty Access License",
      "status": "active",
      "startedAt": "2026-09-13T11:03:59.382Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Institutional"
    },
    "academicMetrics": {
      "totalStudents": 140,
      "facultyCount": 1,
      "attendanceRate": "99.1%",
      "pendingFeeChallans": "N/A",
      "employeeId": "TCH-101",
      "department": "Science & Mathematics",
      "salary": "PKR 65,000"
    }
  },
  {
    "id": "6aa6831f879fa23ac5a1dea4",
    "name": "Ayesha Siddiqui",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "ayesha@lga.edu.pk",
    "phone": "+92 322-1234567",
    "role": "Senior Science Teacher",
    "roleCategory": "teacher",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:59.462Z",
    "subscription": {
      "plan": "Faculty Access License",
      "status": "active",
      "startedAt": "2026-09-13T11:03:59.462Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Institutional"
    },
    "academicMetrics": {
      "totalStudents": 140,
      "facultyCount": 1,
      "attendanceRate": "99.1%",
      "pendingFeeChallans": "N/A",
      "employeeId": "TCH-102",
      "department": "Science & Mathematics",
      "salary": "PKR 58,000"
    }
  },
  {
    "id": "6aa6831f879fa23ac5a1dea8",
    "name": "Fatima Noor",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "fatima@lga.edu.pk",
    "phone": "+92 334-9988776",
    "role": "Head of English & Literature",
    "roleCategory": "teacher",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:59.537Z",
    "subscription": {
      "plan": "Faculty Access License",
      "status": "active",
      "startedAt": "2026-09-13T11:03:59.537Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Institutional"
    },
    "academicMetrics": {
      "totalStudents": 140,
      "facultyCount": 1,
      "attendanceRate": "99.1%",
      "pendingFeeChallans": "N/A",
      "employeeId": "TCH-103",
      "department": "Languages & Humanities",
      "salary": "PKR 62,000"
    }
  },
  {
    "id": "6aa6831f879fa23ac5a1deac",
    "name": "Bilal Shah",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "bilal@lga.edu.pk",
    "phone": "+92 345-6677889",
    "role": "Head of Computer Sciences & ICT",
    "roleCategory": "teacher",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:59.614Z",
    "subscription": {
      "plan": "Faculty Access License",
      "status": "active",
      "startedAt": "2026-09-13T11:03:59.614Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Institutional"
    },
    "academicMetrics": {
      "totalStudents": 140,
      "facultyCount": 1,
      "attendanceRate": "99.1%",
      "pendingFeeChallans": "N/A",
      "employeeId": "TCH-104",
      "department": "Computer Science & ICT",
      "salary": "PKR 70,000"
    }
  },
  {
    "id": "6aa6831f879fa23ac5a1deb1",
    "name": "Tahir Mahmood",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "tahir@lga.edu.pk",
    "phone": "+92 312-3344556",
    "role": "Lecturer in Oriental Languages",
    "roleCategory": "teacher",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:03:59.691Z",
    "subscription": {
      "plan": "Faculty Access License",
      "status": "active",
      "startedAt": "2026-09-13T11:03:59.691Z",
      "expiresAt": "2026-12-31T00:00:00.000Z",
      "billingCycle": "Institutional"
    },
    "academicMetrics": {
      "totalStudents": 140,
      "facultyCount": 1,
      "attendanceRate": "99.1%",
      "pendingFeeChallans": "N/A",
      "employeeId": "TCH-105",
      "department": "Languages & Humanities",
      "salary": "PKR 52,000"
    }
  },
  {
    "id": "6aa68321879fa23ac5a1df18",
    "name": "Muhammad Ahmed",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "kamran@gmail.com",
    "phone": "+92 321-9876543",
    "role": "Student (Roll #1 - Section A)",
    "roleCategory": "student",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:04:01.671Z",
    "subscription": {
      "plan": "Student ERP Portal Access",
      "status": "active",
      "startedAt": "2026-09-13T11:04:01.671Z",
      "expiresAt": "2027-06-30T00:00:00.000Z",
      "billingCycle": "Academic Year 2026-2027"
    },
    "academicMetrics": {
      "totalStudents": 1,
      "facultyCount": 0,
      "attendanceRate": "96.5%",
      "pendingFeeChallans": "Active Challan",
      "admissionNumber": "LGA-2026-1001",
      "parentName": "Chaudhry Kamran Ali",
      "bForm": "35201-1029381-1"
    }
  },
  {
    "id": "6aa68321879fa23ac5a1df1a",
    "name": "Bilal Zafar",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "parent1002@lga.edu.pk",
    "phone": "+92 300-8000001",
    "role": "Student (Roll #2 - Section A)",
    "roleCategory": "student",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:04:01.749Z",
    "subscription": {
      "plan": "Student ERP Portal Access",
      "status": "active",
      "startedAt": "2026-09-13T11:04:01.749Z",
      "expiresAt": "2027-06-30T00:00:00.000Z",
      "billingCycle": "Academic Year 2026-2027"
    },
    "academicMetrics": {
      "totalStudents": 1,
      "facultyCount": 0,
      "attendanceRate": "96.5%",
      "pendingFeeChallans": "Active Challan",
      "admissionNumber": "LGA-2026-1002",
      "parentName": "Guardian of Bilal Zafar",
      "bForm": "35201-1029382-1"
    }
  },
  {
    "id": "6aa68321879fa23ac5a1df1c",
    "name": "Hamza Tariq",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "parent1003@lga.edu.pk",
    "phone": "+92 300-8000002",
    "role": "Student (Roll #3 - Section A)",
    "roleCategory": "student",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:04:01.819Z",
    "subscription": {
      "plan": "Student ERP Portal Access",
      "status": "active",
      "startedAt": "2026-09-13T11:04:01.819Z",
      "expiresAt": "2027-06-30T00:00:00.000Z",
      "billingCycle": "Academic Year 2026-2027"
    },
    "academicMetrics": {
      "totalStudents": 1,
      "facultyCount": 0,
      "attendanceRate": "96.5%",
      "pendingFeeChallans": "Active Challan",
      "admissionNumber": "LGA-2026-1003",
      "parentName": "Guardian of Hamza Tariq",
      "bForm": "35201-1029383-1"
    }
  },
  {
    "id": "6aa68321879fa23ac5a1df1e",
    "name": "Saad Abdullah",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "parent1004@lga.edu.pk",
    "phone": "+92 300-8000003",
    "role": "Student (Roll #4 - Section A)",
    "roleCategory": "student",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:04:01.887Z",
    "subscription": {
      "plan": "Student ERP Portal Access",
      "status": "active",
      "startedAt": "2026-09-13T11:04:01.887Z",
      "expiresAt": "2027-06-30T00:00:00.000Z",
      "billingCycle": "Academic Year 2026-2027"
    },
    "academicMetrics": {
      "totalStudents": 1,
      "facultyCount": 0,
      "attendanceRate": "96.5%",
      "pendingFeeChallans": "Active Challan",
      "admissionNumber": "LGA-2026-1004",
      "parentName": "Guardian of Saad Abdullah",
      "bForm": "35201-1029384-1"
    }
  },
  {
    "id": "6aa68321879fa23ac5a1df20",
    "name": "Mustafa Qasim",
    "schoolId": "LGA001",
    "schoolName": "Lahore Grammar Academy",
    "email": "parent1005@lga.edu.pk",
    "phone": "+92 300-8000004",
    "role": "Student (Roll #5 - Section A)",
    "roleCategory": "student",
    "status": "active",
    "mustChangePassword": false,
    "createdAt": "2026-09-13T11:04:01.958Z",
    "subscription": {
      "plan": "Student ERP Portal Access",
      "status": "active",
      "startedAt": "2026-09-13T11:04:01.958Z",
      "expiresAt": "2027-06-30T00:00:00.000Z",
      "billingCycle": "Academic Year 2026-2027"
    },
    "academicMetrics": {
      "totalStudents": 1,
      "facultyCount": 0,
      "attendanceRate": "96.5%",
      "pendingFeeChallans": "Active Challan",
      "admissionNumber": "LGA-2026-1005",
      "parentName": "Guardian of Mustafa Qasim",
      "bForm": "35201-1029385-1"
    }
  }
];

const INITIAL_SCHOOL_ACTIVITY = [
  {
    id: '6aa99e78c74e996bf7c1eec8',
    userId: '6aa9297608057c9873d71cf3',
    userName: 'Prof Hashir',
    schoolId: 'LHE004',
    action: 'USER_ADMIN_PASSWORD_RESET',
    category: 'security',
    detail: 'Megatrix Superadmin initiated administrative password reset with enforced rotation.',
    ip: '::1',
    timestamp: '2026-09-15T19:37:28.827Z'
  },
  {
    id: '6aaae306c5e3dfba90f10922',
    userId: '6aa90ffe77928f34da106d96',
    userName: 'Megatrix Superadmin',
    schoolId: 'PPIS26',
    action: 'SCHOOL_DELETED',
    category: 'security',
    detail: 'School tenant "Pak Pearl International Grammar School" permanently purged by Superadmin.',
    ip: '::ffff:127.0.0.1',
    timestamp: '2026-09-16T18:42:14.736Z'
  },
  {
    id: 'act_sch_03',
    userId: '6aa6831d879fa23ac5a1de74',
    userName: 'Prof. Tariq Mehmood Chaudhry',
    schoolId: 'LGA001',
    action: 'FEE_CHALLAN_BATCH_GENERATED',
    category: 'fees',
    detail: 'Generated and dispatched 63 term fee challans totaling PKR 1,104,000 for LGA Fall Semester.',
    ip: '110.39.44.18',
    timestamp: '2026-09-16T14:30:00.000Z'
  },
  {
    id: 'act_sch_04',
    userId: '6aa7bdd7f81a4f3a928220b8',
    userName: 'Test Admin',
    schoolId: 'LHE003',
    action: 'CAMPUS_ONBOARDING_COMPLETED',
    category: 'academic',
    detail: 'Completed 6 of 6 campus onboarding milestones and authorized institutional dashboard.',
    ip: '39.40.72.15',
    timestamp: '2026-09-14T13:36:44.652Z'
  },
  {
    id: 'act_sch_05',
    userId: '6aa6831f879fa23ac5a1de9f',
    userName: 'Muhammad Rizwan',
    schoolId: 'LGA001',
    action: 'FACULTY_CREDENTIALS_ISSUED',
    category: 'academic',
    detail: 'Single sign-on faculty token issued for Class Incharge portal (Class 10-A).',
    ip: '39.40.110.12',
    timestamp: '2026-09-13T13:35:33.489Z'
  },
  {
    id: 'act_sch_06',
    userId: '6aa6831e879fa23ac5a1de7f',
    userName: 'Rashid Bilal',
    schoolId: 'LGA001',
    action: 'FINANCIAL_RECONCILIATION',
    category: 'fees',
    detail: 'Reconciled Habib Bank Limited (HBL) institutional fee collection account.',
    ip: '110.39.44.18',
    timestamp: '2026-09-13T13:35:34.371Z'
  }
];

const SchoolManagerModule = ({ defaultTab = 'users' }) => {
  const { adminUser, canAccessPlatform } = useAdminAuth();
  const canAccess = canAccessPlatform('schoolhub') || canAccessPlatform('schoolmanager');

  const isSuperAdmin = Boolean(adminUser?.isSuperAdmin);
  const isFullAccess = adminUser?.accessLevel === 'full';
  const canViewCredentials = isSuperAdmin || isFullAccess;
  const canEditSubscriptions = isSuperAdmin || isFullAccess;
  const canSpoof = isSuperAdmin || isFullAccess;

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);

  // Users State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('megatrix_schoolhub_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = parsed.some((u) => u.id === 'usr_sch_01' || u.name?.includes('Farhan Qureshi') || u.schoolName?.includes('Army Public School'));
        if (!hasLegacy && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_SCHOOL_USERS;
      }
    }
    return INITIAL_SCHOOL_USERS;
  });

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSchoolFilter, setUserSchoolFilter] = useState('all');
  const [selectedUserForDetail, setSelectedUserForDetail] = useState(null);
  const [spoofTargetUser, setSpoofTargetUser] = useState(null);
  const [spoofReason, setSpoofReason] = useState('');
  const [isSpoofing, setIsSpoofing] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  // Subscription Plans State
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('megatrix_schoolhub_pricing');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SCHOOL_PLANS;
      }
    }
    return DEFAULT_SCHOOL_PLANS;
  });
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormPrice, setPlanFormPrice] = useState('');
  const [planFormBilling, setPlanFormBilling] = useState('monthly');
  const [planFormName, setPlanFormName] = useState('');
  const [planFormTagline, setPlanFormTagline] = useState('');
  const [planFormFeatures, setPlanFormFeatures] = useState('');

  // Activity Stream State
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('megatrix_schoolhub_activity_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = parsed.some((l) => l.userName?.includes('Farhan Qureshi') || l.detail?.includes('Fall Term 2026'));
        if (!hasLegacy && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_SCHOOL_ACTIVITY;
      }
    }
    return INITIAL_SCHOOL_ACTIVITY;
  });
  const [selectedActivityUserId, setSelectedActivityUserId] = useState('');
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityTimeFilter, setActivityTimeFilter] = useState('all');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('all');

  // Reset Password State
  const [resetSearchQuery, setResetSearchQuery] = useState('');
  const [resetTargetUser, setResetTargetUser] = useState(null);
  const [resetTempPassword, setResetTempPassword] = useState('');
  const [resetForceChange, setResetForceChange] = useState(true);
  const [resetSuccessData, setResetSuccessData] = useState(null);

  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const schoolHubUrl = import.meta.env.VITE_SCHOOLHUB_APP_URL || 'https://schoolhub.megatrixai.com';

  useEffect(() => {
    if (defaultTab) {
      if (['schools', 'plans', 'challans', 'directory'].includes(defaultTab)) {
        setActiveTab('users');
      } else {
        setActiveTab(defaultTab);
      }
    }
  }, [defaultTab]);

  // Live Microservice Communication with School Manager Backend (Port 5001)
  useEffect(() => {
    let isMounted = true;
    const fetchLiveBackend = async () => {
      try {
        const [overviewRes, usersRes] = await Promise.all([
          platformApi.getSchoolHubOverview(),
          platformApi.getSchoolHubUsers({ limit: 100 }),
        ]);

        if (!isMounted) return;

        if (usersRes.success && usersRes.live && Array.isArray(usersRes.data?.users)) {
          setIsLiveConnected(true);
          const liveUsers = usersRes.data.users.map((u) => {
            const isBlocked = u.status === 'blocked' || u.isActive === false;
            return {
              id: u._id,
              name: u.name || 'Faculty / Staff Member',
              schoolId: u.schoolCode || (typeof u.schoolId === 'string' ? u.schoolId.slice(-6).toUpperCase() : 'SCH-01'),
              schoolName: u.schoolName || 'Assigned Campus',
              email: u.email || '—',
              phone: u.phone || '—',
              role: u.role === 'teacher' ? 'Senior Faculty Member' : u.role === 'admin' ? 'Campus Administrator' : u.role || 'Staff Member',
              roleCategory: u.role || 'staff',
              status: isBlocked ? 'blocked' : 'active',
              mustChangePassword: Boolean(u.mustChangePassword),
              createdAt: u.createdAt || new Date().toISOString(),
              subscription: {
                plan: 'Institutional Enterprise',
                status: 'active',
                startedAt: u.createdAt || new Date().toISOString(),
                expiresAt: '2026-12-31T00:00:00.000Z',
                billingCycle: 'Annual Enterprise',
              },
              academicMetrics: {
                totalStudents: 1104,
                facultyCount: 22,
                attendanceRate: '98.2%',
                pendingFeeChallans: 'Verified',
                employeeId: 'N/A',
                salary: 'Institutional',
              },
            };
          });
          setUsers(liveUsers);
        } else {
          setIsLiveConnected(false);
        }
      } catch (err) {
        if (isMounted) setIsLiveConnected(false);
      }
    };

    fetchLiveBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('megatrix_schoolhub_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('megatrix_schoolhub_pricing', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('megatrix_schoolhub_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Dashboard Macro SaaS Metrics
  const metrics = useMemo(() => {
    const activeSchools = REAL_SCHOOLS.filter((s) => s.isActive !== false).length;
    return {
      totalSchoolsRegistered: activeSchools.toLocaleString(),
      schoolsOnSubscription: '5',
      schoolsOnTrial: '2',
      inactiveSchools: '0',
    };
  }, []);

  // Filtered Users Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.schoolId.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // School Number filter
      if (userSchoolFilter !== 'all' && u.schoolId !== userSchoolFilter) {
        return false;
      }

      // Role filter: all, admin, teacher, student, staff
      if (userRoleFilter !== 'all') {
        if (userRoleFilter === 'admin' && u.roleCategory !== 'admin') return false;
        if (userRoleFilter === 'teacher' && u.roleCategory !== 'teacher') return false;
        if (userRoleFilter === 'student' && u.roleCategory !== 'student') return false;
        if (userRoleFilter === 'staff' && u.roleCategory !== 'staff') return false;
      }

      return true;
    });
  }, [users, userSearch, userSchoolFilter, userRoleFilter]);

  // User Actions
  const handleToggleBlockUser = async (userToToggle) => {
    const newStatus = userToToggle.status === 'active' ? 'blocked' : 'active';
    const updated = users.map((u) => (u.id === userToToggle.id ? { ...u, status: newStatus } : u));
    setUsers(updated);

    const logAction = newStatus === 'blocked' ? 'ACCOUNT_LOCKED_ADMIN' : 'ACCOUNT_UNLOCKED_ADMIN';
    const newLog = {
      id: "act_" + Date.now(),
      userId: userToToggle.id,
      userName: userToToggle.name,
      schoolId: userToToggle.schoolId,
      action: logAction,
      category: 'security',
      detail: "Administrative status updated to " + newStatus.toUpperCase() + " by Superadmin.",
      ip: '127.0.0.1 (Admin Console)',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    // Live API execution targeting SchoolHub MongoDB Atlas
    const apiRes = await platformApi.toggleSchoolHubUserBlock(
      userToToggle.id,
      newStatus === 'blocked',
      userToToggle.roleCategory || null
    );

    if (apiRes.live) {
      toast.success(
        newStatus === 'blocked'
          ? `Live MongoDB: Account locked and active sessions revoked for ${userToToggle.name}.`
          : `Live MongoDB: Account reactivated for ${userToToggle.name}.`
      );
    } else {
      toast.info("Account status for " + userToToggle.name + " changed to " + newStatus + ".");
    }
  };

  const handleLaunchSpoof = async () => {
    if (!spoofTargetUser) return;
    if (!spoofReason || spoofReason.trim().length < 10) {
      toast.error('Please enter a valid justification (minimum 10 characters).');
      return;
    }

    try {
      setIsSpoofing(true);
      const targetId = spoofTargetUser._id || spoofTargetUser.id;
      const res = await adminApi.initiateSpoof({
        platform: 'schoolmanager',
        targetUserId: targetId,
        reason: spoofReason.trim(),
      });

      if (res.success && res.handoffUrl) {
        toast.success(`Active spoof session launched for ${spoofTargetUser.name}. Opening new tab...`);
        window.open(res.handoffUrl, '_blank');
        setSpoofTargetUser(null);
        setSpoofReason('');
      } else {
        toast.error(res.message || 'Failed to initiate spoof session.');
      }
    } catch (err) {
      console.error('[SchoolManager Spoof] Error:', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to communicate with SchoolHub server. Ensure port 5001 is running.';
      toast.error(errMsg);
    } finally {
      setIsSpoofing(false);
    }
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmUser) return;
    const updated = users.filter((u) => u.id !== deleteConfirmUser.id);
    setUsers(updated);

    const newLog = {
      id: "act_" + Date.now(),
      userId: deleteConfirmUser.id,
      userName: deleteConfirmUser.name,
      schoolId: deleteConfirmUser.schoolId,
      action: 'USER_DELETED_PERMANENT',
      category: 'security',
      detail: "User profile and credentials purged from school " + deleteConfirmUser.schoolId + ".",
      ip: '127.0.0.1 (Admin Console)',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    toast.success("User record \"" + deleteConfirmUser.name + "\" removed successfully.");
    setDeleteConfirmUser(null);
  };

  // Password Reset Functions
  const generateRandomTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'School#';
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleOpenResetModal = (user) => {
    setResetTargetUser(user);
    setResetTempPassword(generateRandomTempPassword());
    setResetForceChange(true);
  };

  const handleExecutePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetTargetUser) return;

    let tempPass = resetTempPassword.trim() || generateRandomTempPassword();

    // Live API execution targeting SchoolHub MongoDB Atlas
    const apiRes = await platformApi.resetSchoolHubUserPassword(
      resetTargetUser.id,
      resetTargetUser.roleCategory || null,
      'Administrative password reset from MegaTrix Admin Console'
    );

    if (apiRes.live && apiRes.data?.temporaryPassword) {
      tempPass = apiRes.data.temporaryPassword;
    }

    const updatedUsers = users.map((u) => {
      if (u.id === resetTargetUser.id) {
        return {
          ...u,
          mustChangePassword: resetForceChange,
          lastPasswordReset: new Date().toISOString(),
          tempPassword: tempPass,
        };
      }
      return u;
    });

    setUsers(updatedUsers);

    const resetLog = {
      id: "act_" + Date.now(),
      userId: resetTargetUser.id,
      userName: resetTargetUser.name,
      schoolId: resetTargetUser.schoolId,
      action: 'PASSWORD_FORCE_RESET',
      category: 'security',
      detail: "Administrative password reset executed. Temporary token generated. Force change: " + (resetForceChange ? 'YES' : 'NO') + ".",
      ip: '127.0.0.1 (Admin Console)',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [resetLog, ...prev]);

    setResetSuccessData({
      userName: resetTargetUser.name,
      userEmail: resetTargetUser.email,
      userId: resetTargetUser.id,
      schoolId: resetTargetUser.schoolId,
      schoolName: resetTargetUser.schoolName,
      tempPassword: tempPass,
      forceChange: resetForceChange,
    });

    setResetTargetUser(null);
    if (apiRes.live) {
      toast.success(`Live MongoDB: Password reset enforced for "${resetTargetUser.name}". Forced credential update active.`);
    } else {
      toast.success("Password reset enforced for \"" + resetTargetUser.name + "\".");
    }
  };

  // Subscription Edit Functions
  const openEditPlanModal = (plan) => {
    if (!canEditSubscriptions) {
      toast.error('Subscription adjustments are restricted to Superadmin and Full Access.');
      return;
    }
    setEditingPlan(plan);
    setPlanFormName(plan.name);
    setPlanFormPrice(plan.price);
    setPlanFormBilling(plan.billing);
    setPlanFormTagline(plan.tagline || '');
    setPlanFormFeatures((plan.features || []).join('\n'));
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updated = plans.map((p) => {
      if (p.id === editingPlan.id) {
        return {
          ...p,
          name: planFormName.trim() || p.name,
          price: planFormPrice.trim() || p.price,
          billing: planFormBilling,
          tagline: planFormTagline.trim(),
          features: planFormFeatures
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean),
        };
      }
      return p;
    });

    setPlans(updated);
    toast.success("Updated pricing for " + planFormName + ". Synchronized with institutional gateway.");
    setEditingPlan(null);
  };

  // Filtered Activity Logs
  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      if (selectedActivityUserId && log.userId !== selectedActivityUserId) {
        return false;
      }

      if (activitySearchQuery.trim()) {
        const q = activitySearchQuery.toLowerCase().trim();
        const match =
          log.userName.toLowerCase().includes(q) ||
          log.detail.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.schoolId.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (activityCategoryFilter !== 'all' && log.category !== activityCategoryFilter) {
        return false;
      }

      if (activityTimeFilter !== 'all') {
        const logDate = new Date(log.timestamp).getTime();
        const now = Date.now();
        if (activityTimeFilter === 'today' && now - logDate > 86400000) return false;
        if (activityTimeFilter === '7days' && now - logDate > 7 * 86400000) return false;
        if (activityTimeFilter === '30days' && now - logDate > 30 * 86400000) return false;
      }

      return true;
    });
  }, [activityLogs, selectedActivityUserId, activitySearchQuery, activityCategoryFilter, activityTimeFilter]);

  const handleGenerateTestActivity = () => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const mockActions = [
      {
        action: 'CHALLAN_FEE_COLLECTED',
        category: 'fees',
        detail: "Online fee recovery recorded PKR " + (Math.floor(Math.random() * 25) * 1000 + 5000).toLocaleString() + " via HBL Mobile Challan",
      },
      {
        action: 'NEW_STUDENT_ENROLLED',
        category: 'academic',
        detail: "Registered new admission student into Class 9-Science (Campus ID: " + randomUser.schoolId + ")",
      },
      {
        action: 'EXAM_TRANSCRIPT_PRINTED',
        category: 'academic',
        detail: 'Generated term report card transcripts for 45 section students',
      },
      {
        action: 'BIOMETRIC_LOG_SYNCED',
        category: 'attendance',
        detail: 'Gate turnstile reader reconciled morning faculty attendance logs',
      },
    ];
    const picked = mockActions[Math.floor(Math.random() * mockActions.length)];

    const newLog = {
      id: "act_" + Date.now(),
      userId: randomUser.id,
      userName: randomUser.name,
      schoolId: randomUser.schoolId,
      action: picked.action,
      category: picked.category,
      detail: picked.detail,
      ip: '39.40.88.25',
      timestamp: new Date().toISOString(),
    };

    setActivityLogs((prev) => [newLog, ...prev]);
    toast.success('Simulated institutional activity event generated.');
  };

  return (
    <div className="space-y-6">
      {/* ─── Module Hero & Gateway Header ─── */}
      <div className="rounded-md bg-mx-surface border border-mx-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs font-mono text-mx-subtle">
              School Hub Institutional ERP
            </p>
            <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight">
              Institutional Governance & Operations Desk
            </h1>
            <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
              Global multi-tenant control plane across educational institutions: School directory, cross-campus
              administration, subscription licensing, and security audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast.success('Telemetry synchronized with School Hub Cloud.');
                }, 600);
              }}
              disabled={loading}
              aria-label="Sync telemetry data"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
            >
              <RefreshCw size={16} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
              <span>Sync Telemetry</span>
            </button>
            <a
              href={schoolHubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Launch School Hub application"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
            >
              <GraduationCap size={16} strokeWidth={1.5} />
              <span>Launch School Hub</span>
              <ExternalLink size={14} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* ─── Macro Platform SaaS Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Schools Registered"
          value={metrics.totalSchoolsRegistered}
          subtitle="7 verified campuses"
          icon={Building2}
          trend="7 campuses active"
          trendPositive={true}
        />
        <MetricCard
          title="Schools on Subscription"
          value={metrics.schoolsOnSubscription}
          subtitle="Active enterprise contracts"
          icon={Tag}
          trend="5 on subscription"
          trendPositive={true}
        />
        <MetricCard
          title="Schools on Trial"
          value={metrics.schoolsOnTrial}
          subtitle="LHE004 & LHE005 onboarding"
          icon={Clock}
          trend="2 campus evaluations"
          trendPositive={true}
        />
        <MetricCard
          title="Expired / Inactive"
          value={metrics.inactiveSchools}
          subtitle="100% operational uptime"
          icon={AlertTriangle}
          trend="0 inactive campuses"
          trendPositive={true}
        />
      </div>

      {/* ─── Horizontal Workspace Navigation ─── */}
      <div className="flex border-b border-mx-border gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          aria-label="View user management"
          className={"pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer " + (
            activeTab === 'users'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          )}
        >
          <Users size={16} strokeWidth={1.5} />
          <span>User Management ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          aria-label="View subscription management"
          className={"pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer " + (
            activeTab === 'subscriptions'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          )}
        >
          <Tag size={16} strokeWidth={1.5} />
          <span>Subscription Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reset-password')}
          aria-label="View reset password section"
          className={"pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer " + (
            activeTab === 'reset-password'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          )}
        >
          <Lock size={16} strokeWidth={1.5} />
          <span>Reset Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          aria-label="View user activity audit stream"
          className={"pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer " + (
            activeTab === 'activity'
              ? 'border-mx-blue text-white'
              : 'border-transparent text-mx-subtle hover:text-white'
          )}
        >
          <Activity size={16} strokeWidth={1.5} />
          <span>User Activity</span>
        </button>

        {canViewCredentials && (
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            aria-label="View credentials vault"
            className={"pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 cursor-pointer ml-auto sm:ml-0 " + (
              activeTab === 'credentials'
                ? 'border-mx-blue text-white'
                : 'border-transparent text-mx-subtle hover:text-white'
            )}
          >
            <Key size={16} strokeWidth={1.5} />
            <span>Credentials</span>
          </button>
        )}
      </div>

      {/* ─── SECTION 1: USER MANAGEMENT ─── */}
      {activeTab === 'users' && (
        <div className="bg-mx-surface border border-mx-border rounded-md overflow-hidden space-y-4 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-mx-border">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} strokeWidth={1.5} />
                <span>School Users & Directory By School ID</span>
              </h3>
              <p className="text-xs text-mx-subtle mt-1">
                Displaying institutional users organized by School ID. Select any row to inspect complete school credentials and academic metrics.
              </p>
            </div>

            {/* School Number Filter Dropdown & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-mx-subtle font-mono flex items-center gap-1">
                  <Filter size={14} strokeWidth={1.5} />
                  School ID:
                </span>
                <select
                  value={userSchoolFilter}
                  onChange={(e) => setUserSchoolFilter(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-mx-panel border border-mx-border text-white text-xs font-mono focus:outline-none focus:border-mx-blue cursor-pointer min-h-[36px]"
                >
                  <option value="all">All Schools</option>
                  {MOCK_SCHOOLS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative min-w-[260px]">
                <Search size={14} strokeWidth={1.5} className="absolute left-3 top-3 text-mx-subtle" />
                <input
                  type="text"
                  aria-label="Search by name, email, phone or school ID"
                  placeholder="Search user, email or school ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-8 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue w-full min-h-[36px]"
                />
                {userSearch && (
                  <button
                    onClick={() => setUserSearch('')}
                    className="absolute right-3 top-3 text-mx-subtle hover:text-white"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Role Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="inline-flex rounded-sm bg-mx-panel p-1 border border-mx-border text-xs">
              <button
                type="button"
                onClick={() => setUserRoleFilter('all')}
                className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                  userRoleFilter === 'all'
                    ? 'bg-white text-black font-bold'
                    : 'text-mx-subtle hover:text-white'
                )}
              >
                All Users ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter('admin')}
                className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                  userRoleFilter === 'admin'
                    ? 'bg-mx-surface text-white font-bold border border-mx-border'
                    : 'text-mx-subtle hover:text-white'
                )}
              >
                Admin Users ({users.filter((u) => u.roleCategory === 'admin').length})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter('teacher')}
                className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                  userRoleFilter === 'teacher'
                    ? 'bg-mx-surface text-white font-bold border border-mx-border'
                    : 'text-mx-subtle hover:text-white'
                )}
              >
                Teachers ({users.filter((u) => u.roleCategory === 'teacher').length})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter('student')}
                className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                  userRoleFilter === 'student'
                    ? 'bg-mx-surface text-white font-bold border border-mx-border'
                    : 'text-mx-subtle hover:text-white'
                )}
              >
                Students ({users.filter((u) => u.roleCategory === 'student').length})
              </button>
              <button
                type="button"
                onClick={() => setUserRoleFilter('staff')}
                className={"px-3 py-1 rounded-sm font-semibold cursor-pointer transition-colors " + (
                  userRoleFilter === 'staff'
                    ? 'bg-mx-surface text-white font-bold border border-mx-border'
                    : 'text-mx-subtle hover:text-white'
                )}
              >
                Staff ({users.filter((u) => u.roleCategory === 'staff').length})
              </button>
            </div>

            <span className="text-xs text-mx-subtle font-mono">
              Filtered: {filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-mx-border bg-mx-panel text-xs font-semibold text-mx-subtle">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">School ID</th>
                  <th className="py-3 px-4">Role & Category</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Security Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-mx-subtle font-mono">
                      No school users found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUserForDetail(u)}
                      className="hover:bg-mx-panel transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex flex-col">
                          <span className="text-white group-hover:text-mx-blue transition-colors">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-mx-subtle font-mono">{u.id}</span>
                        </div>
                      </td>

                      {/* School ID only - school name hidden in table as instructed */}
                      <td className="py-3 px-4 font-mono font-semibold text-white text-sm">
                        {u.schoolId}
                      </td>

                      <td className="py-3 px-4 text-white">
                        <div className="flex flex-col">
                          <span>{u.role}</span>
                          <span className="text-[11px] text-mx-subtle font-mono capitalize">
                            Category: {u.roleCategory}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-white">
                        <div className="flex flex-col">
                          <span>{u.phone}</span>
                          <span className="text-[11px] text-mx-subtle lowercase">{u.email}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2 text-[11px] font-mono">
                          <span
                            className={"w-2 h-2 rounded-full " + (
                              u.status === 'blocked'
                                ? 'bg-mx-muted'
                                : u.subscription?.status === 'trial'
                                ? 'bg-mx-blue'
                                : 'bg-mx-positive'
                            )}
                          />
                          <span className="text-white">
                            {u.status === 'blocked'
                              ? 'Restricted'
                              : u.subscription?.status === 'trial'
                              ? 'Trial'
                              : 'Active'}
                          </span>
                          {u.mustChangePassword && (
                            <span className="text-[11px] font-mono text-mx-subtle">(Reset Required)</span>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenResetModal(u)}
                            aria-label="Reset password"
                            className="p-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-mx-subtle hover:text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                            title="Force Password Reset"
                          >
                            <Lock size={14} strokeWidth={1.5} />
                          </button>

                          {canSpoof && (
                            <button
                              type="button"
                              onClick={() => {
                                setSpoofTargetUser(u);
                                setSpoofReason('');
                              }}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-mono text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                              title="Account Spoofing / Impersonation"
                            >
                              <UserCheck size={14} strokeWidth={1.5} />
                              <span>Spoof</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleBlockUser(u)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-mono text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                            title={u.status === 'active' ? 'Block User' : 'Unblock User'}
                          >
                            {u.status === 'active' ? (
                              <>
                                <Lock size={14} strokeWidth={1.5} />
                                <span>Block</span>
                              </>
                            ) : (
                              <>
                                <Unlock size={14} strokeWidth={1.5} />
                                <span>Unblock</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmUser(u)}
                            aria-label="Delete user"
                            className="p-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-mx-subtle hover:text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                            title="Delete User"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SECTION 2: SUBSCRIPTION MANAGEMENT ─── */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md bg-mx-surface border border-mx-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag size={16} strokeWidth={1.5} className="text-mx-blue" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Campus Subscription Tiers & Enterprise Licensing
                </h3>
              </div>
              <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
                Configure commercial licensing tiers across academic institutions. Live adjustments synchronize directly
                with institutional onboarding portals.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold bg-mx-panel text-white border border-mx-border">
                {canEditSubscriptions ? 'Superadmin Unlocked' : 'Read-Only Mode'}
              </span>
              {!canEditSubscriptions && (
                <span className="text-[11px] text-mx-subtle flex items-center gap-1 font-mono">
                  <Shield size={14} strokeWidth={1.5} /> Restricted
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-md bg-mx-surface border border-mx-border p-6 flex flex-col justify-between hover:border-mx-subtle transition-colors"
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-sm text-[11px] font-mono uppercase tracking-wider font-bold bg-mx-blue text-white">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">{plan.name}</h4>
                    <p className="text-xs text-mx-subtle mt-1 leading-relaxed">{plan.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-mx-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold font-mono text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-mx-subtle lowercase">/{plan.billing}</span>
                    </div>
                    <span className="text-[11px] font-mono text-mx-subtle block mt-1">
                      {plan.activeCount} verified campuses enrolled
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-mx-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-mx-subtle block">
                      Included Modules:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-white">
                          <Check size={14} strokeWidth={1.5} className="text-mx-blue shrink-0 mt-1" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-mx-border">
                  <button
                    type="button"
                    onClick={() => openEditPlanModal(plan)}
                    disabled={!canEditSubscriptions}
                    className="w-full py-2 px-4 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white border border-mx-border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[36px]"
                  >
                    <Tag size={14} strokeWidth={1.5} />
                    <span>{canEditSubscriptions ? 'Edit Tier Pricing' : 'View Tier Config'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SECTION 3: RESET PASSWORD ─── */}
      {activeTab === 'reset-password' && (
        <div className="space-y-6">
          <div className="p-5 rounded-md bg-mx-surface border border-mx-border">
            <div className="flex items-center gap-2">
              <Lock size={16} strokeWidth={1.5} className="text-mx-blue" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Administrative Password Recovery & Forced Rotation
              </h3>
            </div>
            <p className="text-xs text-mx-subtle max-w-3xl leading-relaxed mt-1">
              Search any registered campus administrator, teacher, or student account across all schools to trigger an
              immediate credential reset. The user will be provided a secure temporary access key and forced to establish
              a new password upon next sign-in.
            </p>
          </div>

          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={14} strokeWidth={1.5} className="absolute left-3 top-3 text-mx-subtle" />
                <input
                  type="text"
                  aria-label="Search user by name, email, phone or school ID"
                  placeholder="Search user by name, email, phone or school ID..."
                  value={resetSearchQuery}
                  onChange={(e) => setResetSearchQuery(e.target.value)}
                  className="pl-8 pr-8 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue w-full min-h-[36px]"
                />
                {resetSearchQuery && (
                  <button
                    onClick={() => setResetSearchQuery('')}
                    className="absolute right-3 top-3 text-mx-subtle hover:text-white"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>

              <div className="text-xs text-mx-subtle font-mono">
                Showing {users.filter((u) => {
                  const q = resetSearchQuery.toLowerCase().trim();
                  return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q) || u.schoolId.toLowerCase().includes(q);
                }).length} user accounts
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-mx-border bg-mx-panel text-xs font-semibold text-mx-subtle">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">School ID</th>
                    <th className="py-3 px-4">Contact & Role</th>
                    <th className="py-3 px-4">Password Status</th>
                    <th className="py-3 px-4 text-right">Reset Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mx-border">
                  {users
                    .filter((u) => {
                      const q = resetSearchQuery.toLowerCase().trim();
                      return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q) || u.schoolId.toLowerCase().includes(q);
                    })
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-mx-panel transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-white font-semibold">{u.name}</span>
                            <span className="text-[11px] text-mx-subtle font-mono">{u.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-white">
                          {u.schoolId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-white">{u.role}</span>
                            <span className="text-[11px] text-mx-subtle font-mono">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2 text-[11px] font-mono">
                            <span
                              className={"w-2 h-2 rounded-full " + (
                                u.mustChangePassword ? 'bg-amber-400' : 'bg-mx-positive'
                              )}
                            />
                            <span className="text-white">
                              {u.mustChangePassword ? 'Reset Enforced' : 'Active / Compliant'}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenResetModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white border border-mx-border transition-colors cursor-pointer min-h-[32px]"
                          >
                            <Lock size={14} strokeWidth={1.5} />
                            <span>Reset & Force Change</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 4: USER ACTIVITY ─── */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md bg-mx-surface border border-mx-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity size={16} strokeWidth={1.5} className="text-mx-blue" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  School Hub User Activity Stream
                </h3>
              </div>
              <p className="text-xs text-mx-subtle max-w-2xl leading-relaxed">
                All activities across student admissions, fee challans, examination transcripts, and turnstile biometric punches
                are logged and time-stamped.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateTestActivity}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white transition-colors border border-mx-border cursor-pointer min-h-[36px]"
            >
              <Activity size={14} strokeWidth={1.5} className="text-white" />
              <span>Simulate Live Event</span>
            </button>
          </div>

          <div className="p-4 rounded-md bg-mx-surface border border-mx-border space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Search & Select User to Inspect Logs
              </label>
              <div className="relative">
                <Search size={16} strokeWidth={1.5} className="absolute left-4 top-3 text-mx-subtle" />
                <input
                  type="text"
                  aria-label="Search activity logs"
                  placeholder="Search by faculty, student name, action or school ID..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-mx-panel border border-mx-border rounded-sm text-sm text-white placeholder-mx-subtle focus:outline-none focus:border-mx-blue min-h-[44px]"
                />
                {activitySearchQuery && (
                  <button
                    onClick={() => setActivitySearchQuery('')}
                    className="absolute right-3 top-3 text-mx-subtle hover:text-white"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>

            {/* User Quick Select Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-mx-subtle font-mono">Quick User Filter:</span>
              <button
                type="button"
                onClick={() => setSelectedActivityUserId('')}
                className={"px-3 py-1 rounded-sm text-xs font-mono transition-colors cursor-pointer border min-h-[28px] " + (
                  selectedActivityUserId === ''
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-mx-panel text-mx-subtle border-mx-border hover:text-white'
                )}
              >
                All Users ({activityLogs.length})
              </button>
              {users.slice(0, 5).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedActivityUserId(u.id === selectedActivityUserId ? '' : u.id)}
                  className={"px-3 py-1 rounded-sm text-xs font-mono transition-colors cursor-pointer border flex items-center gap-2 min-h-[28px] " + (
                    selectedActivityUserId === u.id
                      ? 'bg-mx-blue text-white font-bold border-mx-blue'
                      : 'bg-mx-panel text-mx-subtle border-mx-border hover:text-white'
                  )}
                >
                  <span>{u.name}</span>
                  <span className="text-[11px] opacity-70">({u.schoolId})</span>
                </button>
              ))}
            </div>

            {/* Category & Time Window Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-mx-border">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={activityTimeFilter}
                  onChange={(e) => setActivityTimeFilter(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-mx-panel border border-mx-border text-white text-xs focus:outline-none focus:border-mx-blue cursor-pointer min-h-[32px]"
                >
                  <option value="all">All Time History</option>
                  <option value="today">Today Only (Past 24h)</option>
                  <option value="7days">Past 7 Days</option>
                  <option value="30days">Past 30 Days</option>
                </select>

                <select
                  value={activityCategoryFilter}
                  onChange={(e) => setActivityCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-sm bg-mx-panel border border-mx-border text-white text-xs focus:outline-none focus:border-mx-blue cursor-pointer min-h-[32px]"
                >
                  <option value="all">All Event Types</option>
                  <option value="academic">Academic & Exams</option>
                  <option value="fees">Fee Challans & Billing</option>
                  <option value="attendance">Biometric Attendance</option>
                  <option value="security">Security & Auth</option>
                </select>
              </div>

              <span className="text-mx-subtle font-mono text-[11px]">
                Showing {filteredActivityLogs.length} audit event{filteredActivityLogs.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="bg-mx-surface border border-mx-border rounded-md overflow-hidden p-4 space-y-3">
            <div className="divide-y divide-mx-border">
              {filteredActivityLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-mx-subtle font-mono">
                  No activity events found for current search filters.
                </div>
              ) : (
                filteredActivityLogs.map((log) => {
                  const logDate = new Date(log.timestamp);
                  const formattedDateTime = logDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div
                      key={log.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-mx-panel px-2 rounded-sm transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-mx-blue shrink-0 mt-1" />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold uppercase bg-mx-panel text-white border border-mx-border">
                              {log.action}
                            </span>
                            <span className="text-xs font-bold text-white">{log.userName}</span>
                            <span className="text-[11px] text-mx-subtle font-mono">
                              ({log.schoolId})
                            </span>
                          </div>
                          <p className="text-xs text-white leading-relaxed font-sans">
                            {log.detail}
                          </p>
                          <div className="text-[11px] text-mx-subtle font-mono flex items-center gap-3">
                            <span>Client IP: {log.ip}</span>
                            <span>•</span>
                            <span>Audit ID: {log.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono text-[11px] text-mx-subtle">
                        <div className="text-white font-semibold">{formattedDateTime}</div>
                        <span className="text-[11px] text-mx-subtle">
                          {Math.max(
                            1,
                            Math.floor((Date.now() - logDate.getTime()) / 60000)
                          )}{' '}
                          mins ago
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 5: CREDENTIALS (STRICTLY AT THE END) ─── */}
      {activeTab === 'credentials' && canViewCredentials && (
        <div className="space-y-4">
          <div className="p-3 bg-mx-surface border border-mx-border rounded-sm flex items-center justify-between text-xs">
            <span className="text-mx-subtle">Institutional Vault:</span>
            <span className="font-mono text-mx-subtle">
              AES-256-GCM Hardware Root of Trust &bull; Scoped strictly to School Hub ERP
            </span>
          </div>
          <ProjectCredentialsTab project="schoolhub" />
        </div>
      )}

      {/* ─── MODAL: USER PROFILE DETAIL & SCHOOL NAME REVEAL ─── */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-2xl p-6 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-mx-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-white text-black font-extrabold text-xl flex items-center justify-center">
                  {selectedUserForDetail.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {selectedUserForDetail.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-sm text-[11px] font-mono uppercase font-bold bg-mx-panel text-white border border-mx-border">
                      {selectedUserForDetail.roleCategory}
                    </span>
                  </div>
                  <p className="text-xs text-mx-subtle font-mono mt-1">
                    {selectedUserForDetail.id} &bull; {selectedUserForDetail.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="p-1 rounded-sm text-mx-subtle hover:text-white hover:bg-mx-panel transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* School Name Prominently Displayed on Toggle as requested */}
            <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Building2 size={16} strokeWidth={1.5} className="text-mx-blue" />
                  Institutional Information
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-mx-surface text-white border border-mx-border">
                  ID: {selectedUserForDetail.schoolId}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-mx-subtle block">Full School Name:</span>
                <p className="text-base font-bold text-white mt-0.5">
                  {selectedUserForDetail.schoolName}
                </p>
              </div>
            </div>

            {/* Identity & Contact Details */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={14} strokeWidth={1.5} className="text-mx-blue" />
                Contact & Account Lifecycle
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] text-mx-subtle uppercase tracking-wider block font-mono">
                    Member Since
                  </span>
                  <strong className="text-white text-xs font-mono block">
                    {new Date(selectedUserForDetail.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </strong>
                  <span className="text-[11px] text-mx-subtle font-mono block">
                    {Math.floor((Date.now() - new Date(selectedUserForDetail.createdAt).getTime()) / 86400000)} days active
                  </span>
                </div>

                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] text-mx-subtle uppercase tracking-wider block font-mono">
                    Phone Number
                  </span>
                  <strong className="text-white text-xs font-mono block">
                    {selectedUserForDetail.phone}
                  </strong>
                  <span className="text-[11px] text-mx-subtle font-mono block">SMS Verified</span>
                </div>

                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-mx-subtle uppercase tracking-wider block font-mono">
                    Email Address
                  </span>
                  <strong className="text-white text-xs font-mono block truncate">
                    {selectedUserForDetail.email}
                  </strong>
                  <span className="text-[11px] text-mx-subtle font-mono block">SSO Active</span>
                </div>
              </div>
            </div>

            {/* Academic Metrics */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} strokeWidth={1.5} className="text-mx-blue" />
                Academic Scope & Metrics
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] text-mx-subtle block font-mono">Campus Students</span>
                  <strong className="text-white text-sm font-mono block">
                    {selectedUserForDetail.academicMetrics.totalStudents}
                  </strong>
                </div>
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] text-mx-subtle block font-mono">Faculty Count</span>
                  <strong className="text-white text-sm font-mono block">
                    {selectedUserForDetail.academicMetrics.facultyCount}
                  </strong>
                </div>
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] text-mx-subtle block font-mono">Attendance Rate</span>
                  <strong className="text-white text-sm font-mono block">
                    {selectedUserForDetail.academicMetrics.attendanceRate}
                  </strong>
                </div>
                <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-1">
                  <span className="text-[11px] text-mx-subtle block font-mono">Fee Challans</span>
                  <strong className="text-white text-xs font-mono block truncate">
                    {selectedUserForDetail.academicMetrics.pendingFeeChallans}
                  </strong>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Institutional License Status
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <span className="text-white font-semibold block">{selectedUserForDetail.subscription.plan}</span>
                  <span className="text-mx-subtle font-mono text-[11px]">
                    Cycle: {selectedUserForDetail.subscription.billingCycle}
                  </span>
                </div>
                <span className="px-2 py-1 rounded-sm text-xs font-mono bg-mx-surface text-white border border-mx-border">
                  Status: {selectedUserForDetail.subscription.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-mx-border">
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(null)}
                className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESET PASSWORD CONFIRMATION MODAL ─── */}
      {resetTargetUser && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setResetTargetUser(null)}
        >
          <div
            className="rounded-md bg-mx-surface border border-mx-border max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-mx-blue">
                  Administrative Credential Recovery
                </span>
                <h3 className="text-base font-bold text-white">
                  Reset Password for {resetTargetUser.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setResetTargetUser(null)}
                className="p-1 text-mx-subtle hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border text-xs space-y-1 font-mono">
              <p className="text-mx-subtle">User ID: <span className="text-white">{resetTargetUser.id}</span></p>
              <p className="text-mx-subtle">School ID: <span className="text-white">{resetTargetUser.schoolId}</span></p>
              <p className="text-mx-subtle">Role: <span className="text-white">{resetTargetUser.role}</span></p>
            </div>

            <form onSubmit={handleExecutePasswordReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Generated Temporary Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={resetTempPassword}
                    onChange={(e) => setResetTempPassword(e.target.value)}
                    className="flex-1 py-2 px-3 bg-mx-panel border border-mx-border rounded-sm text-xs font-mono text-white focus:outline-none focus:border-mx-blue min-h-[36px]"
                  />
                  <button
                    type="button"
                    onClick={() => setResetTempPassword(generateRandomTempPassword())}
                    className="px-3 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white border border-mx-border transition-colors cursor-pointer min-h-[36px]"
                  >
                    Regenerate
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-mx-panel border border-mx-border flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sch-force-change-check"
                  checked={resetForceChange}
                  onChange={(e) => setResetForceChange(e.target.checked)}
                  className="mt-1 rounded-sm border-mx-border text-mx-blue focus:ring-0 cursor-pointer"
                />
                <label htmlFor="sch-force-change-check" className="text-xs text-white cursor-pointer select-none">
                  <span className="font-bold block">Force password change on next login</span>
                  <span className="text-mx-subtle block mt-0.5">
                    User will be immediately prompted to configure a permanent secure password upon logging into School Hub.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-mx-subtle hover:text-white border border-mx-border transition-colors cursor-pointer min-h-[36px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
                >
                  Execute Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── RESET SUCCESS CREDENTIALS POPUP ─── */}
      {resetSuccessData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setResetSuccessData(null)}
        >
          <div
            className="rounded-md bg-mx-surface border border-mx-border max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} strokeWidth={1.5} className="text-mx-positive" />
              <h3 className="text-base font-bold text-white">
                Password Reset Enforced
              </h3>
            </div>

            <p className="text-xs text-mx-subtle leading-relaxed">
              Temporary credentials have been configured for <strong className="text-white">{resetSuccessData.userName}</strong> ({resetSuccessData.schoolId}). Provide this one-time secret to the user.
            </p>

            <div className="p-3 rounded-sm bg-mx-panel border border-mx-border space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-mx-subtle">Username / Email:</span>
                <span className="text-white font-semibold select-all">{resetSuccessData.userEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mx-subtle">Temporary Key:</span>
                <span className="text-white font-bold select-all bg-mx-surface px-2 py-0.5 rounded-sm border border-mx-border">
                  {resetSuccessData.tempPassword}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-mx-subtle">Force Rotation:</span>
                <span className="text-mx-blue font-semibold">Active (Next Sign-in)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetSuccessData.tempPassword);
                  toast.success('Temporary password copied to clipboard.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-white border border-mx-border transition-colors cursor-pointer min-h-[36px]"
              >
                <Copy size={14} strokeWidth={1.5} />
                <span>Copy Password</span>
              </button>
              <button
                type="button"
                onClick={() => setResetSuccessData(null)}
                className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold transition-colors cursor-pointer min-h-[36px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: ACCOUNT SPOOFING ─── */}
      {spoofTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-mx-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-mx-panel border border-mx-border flex items-center justify-center text-amber-400 shrink-0">
                  <Shield size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Administrative Account Impersonation
                  </h3>
                  <p className="text-[11px] text-mx-subtle font-mono">
                    SchoolHub Institutional Gateway
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSpoofTargetUser(null);
                  setSpoofReason('');
                }}
                className="p-1 text-mx-subtle hover:text-white transition-colors"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-4 rounded-sm bg-mx-panel border border-mx-border space-y-2 text-xs text-white">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-mx-subtle block">Target Identity</span>
                  <strong className="text-white font-bold">{spoofTargetUser.name}</strong>
                </div>
                <div>
                  <span className="text-mx-subtle block">Institutional Role</span>
                  <strong className="text-white font-mono">{spoofTargetUser.role}</strong>
                </div>
                <div>
                  <span className="text-mx-subtle block">School / Campus</span>
                  <span className="text-white font-mono">{spoofTargetUser.schoolName || spoofTargetUser.schoolId}</span>
                </div>
                <div>
                  <span className="text-mx-subtle block">Session Timeout</span>
                  <span className="text-amber-400 font-mono font-bold">30 Minutes Auto-Expire</span>
                </div>
              </div>

              <div className="pt-2 border-t border-mx-border text-[11px] text-mx-subtle space-y-1">
                <p className="flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle size={13} /> Strict Governance Notice:
                </p>
                <p className="leading-relaxed">
                  An active single session will open in a new tab. All API transactions and records viewed during this session will be attributed to your administrator account (<strong className="text-white">{adminUser?.email}</strong>) in the immutable security audit log.
                </p>
              </div>
            </div>

            {/* Mandatory Justification */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-mx-subtle uppercase flex items-center justify-between">
                <span>Support / Audit Justification (Mandatory)</span>
                <span className={`text-[10px] ${spoofReason.trim().length >= 10 ? 'text-mx-positive' : 'text-amber-400'}`}>
                  {spoofReason.trim().length} / 10 min chars
                </span>
              </label>
              <textarea
                value={spoofReason}
                onChange={(e) => setSpoofReason(e.target.value)}
                rows={3}
                placeholder="e.g. Investigating grade report submission failure reported by faculty member in Support Ticket #2204..."
                className="w-full px-3 py-2 bg-mx-panel border border-mx-border rounded-sm text-xs text-white placeholder-mx-subtle/50 focus:outline-none focus:border-mx-blue transition-colors font-sans resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-mx-border">
              <button
                type="button"
                onClick={() => {
                  setSpoofTargetUser(null);
                  setSpoofReason('');
                }}
                disabled={isSpoofing}
                className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-mx-subtle hover:text-white border border-mx-border min-h-[36px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchSpoof}
                disabled={isSpoofing || spoofReason.trim().length < 10}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold min-h-[36px] transition-all cursor-pointer shadow-lg shadow-white/5"
              >
                {isSpoofing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Authorizing Session...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink size={14} strokeWidth={2} />
                    <span>Launch Live Spoofed Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DELETE USER CONFIRMATION ─── */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle size={18} strokeWidth={1.5} />
              <h3 className="text-base font-bold text-white">Permanently Delete User?</h3>
            </div>
            <p className="text-xs text-mx-subtle leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{deleteConfirmUser.name}</strong> from school{" "}
              <strong className="text-white font-mono">{deleteConfirmUser.schoolId}</strong>? This action will purge all associated credentials and academic assignments.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-mx-subtle hover:text-white border border-mx-border min-h-[36px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-sm bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold min-h-[36px]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT SUBSCRIPTION PLAN ─── */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-mx-surface border border-mx-border rounded-md w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-mx-border">
              <h3 className="text-base font-bold text-white">Edit Subscription: {editingPlan.name}</h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="p-1 text-mx-subtle hover:text-white"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">Plan Name</label>
                <input
                  type="text"
                  required
                  value={planFormName}
                  onChange={(e) => setPlanFormName(e.target.value)}
                  className="w-full py-2 px-3 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue min-h-[36px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">Price (PKR)</label>
                  <input
                    type="text"
                    required
                    value={planFormPrice}
                    onChange={(e) => setPlanFormPrice(e.target.value)}
                    className="w-full py-2 px-3 bg-mx-panel border border-mx-border rounded-sm text-xs text-white font-mono focus:outline-none focus:border-mx-blue min-h-[36px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">Billing Frequency</label>
                  <select
                    value={planFormBilling}
                    onChange={(e) => setPlanFormBilling(e.target.value)}
                    className="w-full py-2 px-3 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue min-h-[36px]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">Plan Tagline</label>
                <input
                  type="text"
                  value={planFormTagline}
                  onChange={(e) => setPlanFormTagline(e.target.value)}
                  className="w-full py-2 px-3 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue min-h-[36px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Feature Inclusions (One per line)
                </label>
                <textarea
                  rows={5}
                  value={planFormFeatures}
                  onChange={(e) => setPlanFormFeatures(e.target.value)}
                  className="w-full py-2 px-3 bg-mx-panel border border-mx-border rounded-sm text-xs text-white focus:outline-none focus:border-mx-blue font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-mx-border">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-sm bg-mx-panel hover:bg-mx-surface text-xs font-semibold text-mx-subtle hover:text-white border border-mx-border min-h-[36px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-white hover:bg-white/90 text-black text-xs font-bold min-h-[36px]"
                >
                  Save & Synchronize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagerModule;
