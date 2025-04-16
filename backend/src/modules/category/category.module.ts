import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import {CategoryResolver} from "@/src/modules/category/category.resolver";

@Module({
  providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
