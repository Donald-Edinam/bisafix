import { apiReference } from '@scalar/express-api-reference';
import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Load OpenAPI spec
const openapiSpec = yaml.load(
    readFileSync(join(__dirname, '../../openapi.yaml'), 'utf8'),
);

// Scalar API documentation endpoint
router.use(
    '/docs',
    apiReference({
        spec: {
            content: openapiSpec,
        },
        darkMode: true,
        layout: 'modern',
        showSidebar: true,
    }),
);

export default router;
