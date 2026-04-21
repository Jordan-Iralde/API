import { Request, Response } from "express";
import { coursesService } from "./courses.service";

export const getCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = await coursesService.getAll();
  res.json(data);
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const course = await coursesService.create(req.body);
  res.json(course);
};