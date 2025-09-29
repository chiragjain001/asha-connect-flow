export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  address: string;
  healthId?: string;
  syncStatus: "synced" | "pending" | "offline";
  lastVisit: string;
  riskLevel: "low" | "medium" | "high";
  conditions: string[];
  vaccinations: Vaccination[];
  visits: Visit[];
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  dueDate?: string;
  status: "completed" | "due" | "overdue";
}

export interface Visit {
  id: string;
  date: string;
  type: "routine" | "follow-up" | "emergency";
  vitals: {
    weight?: number;
    height?: number;
    bp?: string;
    temperature?: number;
    pulse?: number;
  };
  notes: string;
  symptoms: string[];
  diagnosis?: string;
}

export interface AIAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: "high" | "medium" | "low";
  type: "vaccination" | "vital-signs" | "follow-up" | "risk-assessment";
  message: string;
  recommendation: string;
  createdAt: string;
}

// Mock Data
export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sunita Kumari",
    age: 28,
    gender: "Female",
    phone: "+91 9876543210",
    address: "House No. 45, Village Rampur, Block Sadar",
    healthId: "91-1234-5678-9012",
    syncStatus: "synced",
    lastVisit: "2024-01-15",
    riskLevel: "high",
    conditions: ["Pregnant - 7 months", "Anemia"],
    vaccinations: [
      {
        id: "v1",
        name: "TT-1",
        date: "2023-08-15",
        status: "completed"
      },
      {
        id: "v2",
        name: "TT-2",
        date: "2023-10-15", 
        status: "completed"
      }
    ],
    visits: [
      {
        id: "vis1",
        date: "2024-01-15",
        type: "routine",
        vitals: {
          weight: 58,
          bp: "140/90",
          temperature: 98.6,
          pulse: 78
        },
        notes: "Patient complaining of headaches and swelling in feet. BP elevated.",
        symptoms: ["Headache", "Swelling", "Fatigue"],
        diagnosis: "Possible Pre-eclampsia - Requires immediate PHC referral"
      }
    ]
  },
  {
    id: "2",
    name: "Rohan Singh",
    age: 2,
    gender: "Male",
    phone: "+91 9876543211",
    address: "House No. 12, Village Rampur, Block Sadar",
    healthId: "91-1234-5678-9013",
    syncStatus: "pending",
    lastVisit: "2024-01-10",
    riskLevel: "medium",
    conditions: ["Growth Monitoring"],
    vaccinations: [
      {
        id: "v3",
        name: "OPV-1",
        date: "2022-02-15",
        status: "completed"
      },
      {
        id: "v4",
        name: "DPT-1",
        date: "2022-04-15",
        status: "completed"
      },
      {
        id: "v5",
        name: "MMR",
        date: "2024-02-15",
        dueDate: "2024-02-15",
        status: "due"
      }
    ],
    visits: [
      {
        id: "vis2",
        date: "2024-01-10",
        type: "routine",
        vitals: {
          weight: 11.2,
          height: 85
        },
        notes: "Child's weight has been stagnant for last 3 visits. Mother reports decreased appetite.",
        symptoms: ["Decreased appetite", "Lethargy"],
        diagnosis: "Possible malnutrition - Monitor closely"
      }
    ]
  },
  {
    id: "3",
    name: "Rajesh Verma",
    age: 55,
    gender: "Male",
    phone: "+91 9876543212",
    address: "House No. 78, Village Rampur, Block Sadar",
    syncStatus: "offline",
    lastVisit: "2024-01-08",
    riskLevel: "low",
    conditions: ["Diabetes", "Hypertension"],
    vaccinations: [],
    visits: [
      {
        id: "vis3",
        date: "2024-01-08",
        type: "follow-up",
        vitals: {
          weight: 72,
          bp: "130/85",
          temperature: 98.4,
          pulse: 72
        },
        notes: "Regular diabetic follow-up. Patient reports taking medications regularly.",
        symptoms: [],
        diagnosis: "Stable diabetes and hypertension"
      }
    ]
  },
  {
    id: "4",
    name: "Priya Sharma", 
    age: 24,
    gender: "Female",
    phone: "+91 9876543213",
    address: "House No. 23, Village Rampur, Block Sadar",
    healthId: "91-1234-5678-9014",
    syncStatus: "synced",
    lastVisit: "2024-01-12",
    riskLevel: "low",
    conditions: ["Post-delivery care"],
    vaccinations: [
      {
        id: "v6",
        name: "TT Booster",
        date: "2023-11-15",
        status: "completed"
      }
    ],
    visits: [
      {
        id: "vis4",
        date: "2024-01-12",
        type: "routine",
        vitals: {
          weight: 52,
          bp: "110/70",
          temperature: 98.2,
          pulse: 68
        },
        notes: "Post-delivery check-up. Mother and baby doing well. Breastfeeding established.",
        symptoms: [],
        diagnosis: "Normal post-delivery recovery"
      }
    ]
  }
];

export const mockAlerts: AIAlert[] = [
  {
    id: "alert1",
    patientId: "1",
    patientName: "Sunita Kumari",
    severity: "high",
    type: "vital-signs",
    message: "High Risk: Patient showing signs of pre-eclampsia with elevated BP (140/90) and symptoms.",
    recommendation: "Immediate PHC referral required. Monitor BP closely and advise bed rest.",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "alert2", 
    patientId: "2",
    patientName: "Rohan Singh",
    severity: "medium",
    type: "risk-assessment",
    message: "Growth Concern: Child's weight stagnant for 3 consecutive visits (11.2kg).",
    recommendation: "Nutritional counseling for mother. Schedule weekly weight monitoring.",
    createdAt: "2024-01-10T14:15:00Z"
  },
  {
    id: "alert3",
    patientId: "2", 
    patientName: "Rohan Singh",
    severity: "medium",
    type: "vaccination",
    message: "Vaccination Due: MMR vaccine due on February 15, 2024.",
    recommendation: "Schedule vaccination appointment at nearest PHC or outreach session.",
    createdAt: "2024-01-12T09:00:00Z"
  }
];