import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // Publiczne endpointy
    @Get()
    findAll(
        @Query('club') club?: string,
        @Query('type') type?: string,
        @Query('size') size?: string
    ) {
        return this.productsService.findAll(club, type, size);
    };

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    };

    @Get('slug/:slug')
    findOneBySlug(@Param('slug') slug: string) {
        return this.productsService.findOneBySlug(slug);
    };
}