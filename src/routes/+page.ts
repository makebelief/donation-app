import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        return {
            projects
        };
    } catch (error) {
        console.error('Error loading projects:', error);
        return {
            projects: []
        };
    }
}; 