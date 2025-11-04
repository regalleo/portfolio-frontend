import { useQuery } from '@tanstack/react-query';
import { skillsAPI, projectsAPI, experienceAPI, aboutAPI } from '../services/api';

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: skillsAPI.getAll,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getAll,
  });
};

export const useExperience = () => {
  return useQuery({
    queryKey: ['experience'],
    queryFn: experienceAPI.getAll,
  });
};

export const useAbout = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: aboutAPI.getPrimary,
  });
};
