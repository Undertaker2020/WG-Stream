import {Args, Query, Resolver} from "@nestjs/graphql";
import {CategoryService} from "@/src/modules/category/category.service";
import {CategoryModel} from "@/src/modules/category/models/category.model";

@Resolver('Category')
export class CategoryResolver {
    public constructor(private readonly categoryService: CategoryService) {
    }

    @Query(() => [CategoryModel], {name: 'findAllCategories'})
    public async findAll() {
        return this.categoryService.findAll();
    }

    @Query(() => [CategoryModel], {name: 'findRandomCategories'})
    public async findRandom() {
        return this.categoryService.findRandom();
    }

    @Query(() => CategoryModel, {name: 'findCategoryBySlug'})
    public async findBySlug(
        @Args('slug') slug: string,
    ) {
        return this.categoryService.findBySlug(slug);
    }
}