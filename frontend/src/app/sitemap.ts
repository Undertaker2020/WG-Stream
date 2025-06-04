import type { MetadataRoute } from 'next';

import {
    FindAllCategoriesDocument,
    type FindAllCategoriesQuery,
} from '@/graphql/generated/output';
import { APP_URL, SERVER_URL } from '@/libs/constants/url.constants';

async function findAllCategories(): Promise<
    FindAllCategoriesQuery['findAllCategories']
> {
    try {
        const query = FindAllCategoriesDocument.loc?.source.body;

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
            next: {
                revalidate: 30,
            },
        });

        if (!response.ok) {
            console.warn(
                'Sitemap: сервер повернув статус',
                response.status,
                '– повертаю порожній масив категорій',
            );
            return [];
        }

        const json = await response.json();
        const cats = json?.data?.findAllCategories;
        if (!Array.isArray(cats)) {
            console.warn(
                'Sitemap: у відповіді нема data.findAllCategories – повертаю []',
            );
            return [];
        }

        return cats as FindAllCategoriesQuery['findAllCategories'];
    } catch (error) {
        console.warn('Sitemap: не вдалося отримати categories, повертаю []', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const categories = await findAllCategories();

    const routes: MetadataRoute.Sitemap = [
        {
            url: APP_URL,
            lastModified: new Date().toISOString(),
            priority: 1.0,
        },
        {
            url: APP_URL + '/streams',
            lastModified: new Date().toISOString(),
            priority: 0.8,
        },
        {
            url: APP_URL + '/categories',
            lastModified: new Date().toISOString(),
            priority: 0.7,
        },
    ];

    if (categories.length > 0) {
        categories.forEach((category) => {
            routes.push({
                url: APP_URL + `/categories/${category.slug}`,
                lastModified: category.updatedAt,
                priority: 0.6,
            });
        });
    }

    return routes;
}