import { db } from './index.js';

const projects = [
    {
        title: "Clean Water Initiative",
        description: "Our Clean Water Initiative aims to provide sustainable access to clean and safe drinking water for rural communities in Kenya. Through the installation of water wells, filtration systems, and community education programs, we're working to eliminate waterborne diseases and improve overall health outcomes.",
        target_amount: 50000,
        current_amount: 15000,
        image_url: "https://placehold.co/600x400/EEE/31343C?text=Water+Project",
        location: "Kakamega, Kenya",
        category: "Water & Sanitation"
    },
    {
        title: "Education for All",
        description: "Education for All is dedicated to making quality education accessible to children in underserved communities across Tanzania. We're building new classrooms, providing educational materials, and training local teachers to create sustainable learning environments.",
        target_amount: 75000,
        current_amount: 25000,
        image_url: "https://placehold.co/600x400/EEE/31343C?text=Education+Project",
        location: "Arusha, Tanzania",
        category: "Education"
    },
    {
        title: "Healthcare Access",
        description: "Our mobile clinic initiative brings essential healthcare services to remote villages in Uganda. We provide preventive care, maternal health services, and basic medical treatment to communities with limited access to healthcare facilities.",
        target_amount: 100000,
        current_amount: 45000,
        image_url: "https://placehold.co/600x400/EEE/31343C?text=Healthcare+Project",
        location: "Gulu, Uganda",
        category: "Healthcare"
    },
    {
        title: "Sustainable Farming",
        description: "Supporting small-scale farmers with modern agricultural techniques, equipment, and training. This project helps farmers increase crop yields, implement sustainable practices, and improve their economic stability.",
        target_amount: 25000,
        current_amount: 10000,
        image_url: "https://placehold.co/600x400/EEE/31343C?text=Farming+Project",
        location: "Morogoro, Tanzania",
        category: "Agriculture"
    }
];

const donations = [
    {
        project_id: 1,
        amount: 1000,
        transaction_id: "MPE123456",
        donor_phone: "+254722123456",
        donor_name: "Anonymous"
    },
    {
        project_id: 2,
        amount: 2500,
        transaction_id: "MPE123457",
        donor_phone: "+254722123457",
        donor_name: "Anonymous"
    },
    {
        project_id: 3,
        amount: 5000,
        transaction_id: "MPE123458",
        donor_phone: "+254722123458",
        donor_name: "Anonymous"
    }
];

export function seedDatabase() {
    try {
        // Clear existing data
        db.run('DELETE FROM donations');
        db.run('DELETE FROM projects');
        
        // Reset auto-increment
        db.run('DELETE FROM sqlite_sequence WHERE name="projects" OR name="donations"');

        // Insert projects
        for (const project of projects) {
            db.run(
                'INSERT INTO projects (title, description, target_amount, current_amount, image_url, location, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [project.title, project.description, project.target_amount, project.current_amount, project.image_url, project.location, project.category]
            );
        }

        // Insert donations
        for (const donation of donations) {
            db.run(
                'INSERT INTO donations (project_id, amount, transaction_id, donor_phone, donor_name) VALUES (?, ?, ?, ?, ?)',
                [donation.project_id, donation.amount, donation.transaction_id, donation.donor_phone, donation.donor_name]
            );
        }

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
} 