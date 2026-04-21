import { db } from "../../core/db";
import { courses } from "../../core/db/schema";

type CreateCourseDTO = {
  title: string;
  description: string;
};

export const coursesService = {
  getAll: () => db.select().from(courses),

  create: (data: CreateCourseDTO) =>
    db.insert(courses).values(data),
};