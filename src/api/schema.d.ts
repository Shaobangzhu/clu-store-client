// Generated from API merge 8929c5fe24205e814db05a12642aad61d7c25a60. Do not edit.
export interface paths {
    "/api/products/offers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read active scheduled offers
         * @description Only active offers with startsAt <= now and endsAt > now; null bounds are unbounded. Historical 2025 campaigns remain inactive. Marketing soldOut is independent of SKU stock.
         */
        get: operations["offers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/products/newarrivals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read editorial new-arrival cards
         * @description Ordered by displayOrder ASC,id ASC. Linked productId may be null for non-product editorial cards.
         */
        get: operations["arrivals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search and paginate products
         * @description Literal case-insensitive substring search across product name/title/category title or slug. Unknown category filters return an empty list. ID breaks sort ties. Unknown/repeated query keys are rejected. page default 1/max 10000; pageSize default 20/max 100. newest sorts createdAt DESC; prices use Decimal startingPrice; name sorts use DB collation; ties use id ASC. Memory price is incremental.
         */
        get: operations["products"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/products/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read product and SKU options
         * @description Original numeric catalog ID. image retains the observed legacy field name; models[].price is a complete base and memorySizes[].price an increment, both strings. colors is a name array. Unknown product is 404.
         */
        get: operations["product"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read category navigation
         * @description Category ID/title/slug/subTitle summaries in ID order.
         */
        get: operations["categories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/categories/{title}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read category landing content
         * @description Case-insensitive title or slug, URL-decoded exactly once by Express. At most 128 decoded characters, no slash/backslash/control. Unknown category is 404. Landing content contains videos, editorial features and product summaries.
         */
        get: operations["category"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/information/support": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read sanitized support information
         * @description data is explicitly {html,locale}. Reviewed original support HTML is sanitized on read with a tag allowlist and no attributes/links. Never arbitrary source HTML.
         */
        get: operations["support"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register a USER account
         * @description Email is required. Exactly one matching confirmPassword or deprecated ConfirmPassword is required. Username/email are trimmed, lowercased and uniquely normalized. Password is 15–128 characters, long and uncommon. Client role rejected. Strict IP/account limits. Synthetic examples are not provisioned.
         */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Log in by username or email
         * @description Exactly one identifier or deprecated username alias. Generic failure for unknown user/wrong password. Returns safe user plus HS256 bearer token metadata. Env-only key, issuer/audience validation and finite TTL (default 900s); role is re-fetched per protected request. Synthetic examples are not provisioned.
         */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Recover the current authenticated user
         * @description Valid Bearer JWT required. Returns current database user id, username, email, role and createdAt only. Invalid/expired tokens and deleted users return 401. Cache-Control: no-store. Global rate limit applies; login/register credential budgets do not.
         */
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/shopping-cart/items/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete own cart line
         * @description Foreign and missing cart line IDs have the same 404. Success has no response body.
         */
        delete: operations["removeCartItem"];
        options?: never;
        head?: never;
        /**
         * Set an owned cart line quantity
         * @description Absolute integer qty, not an increment. Zero is invalid; use DELETE to remove. Foreign/missing IDs return identical 404. Full SKU identity is retained. Owner lock serializes updates with add/delete/clear/checkout; last serialized update wins. Returns the updated line with live unitPrice and lineTotal; GET cart returns aggregate totals. Invalid existing cart returns 422. Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart.
         */
        patch: operations["updateCartItem"];
        trace?: never;
    };
    "/api/ShoppingCart/items/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete own cart line (legacy casing alias)
         * @description Foreign and missing cart line IDs have the same 404. Success has no response body. Same router and semantics as /api/shopping-cart/items/{id}; new clients should use canonical lowercase.
         */
        delete: operations["removeCartItemLegacy"];
        options?: never;
        head?: never;
        /**
         * Set an owned cart line quantity (legacy casing alias)
         * @description Absolute integer qty, not an increment. Zero is invalid; use DELETE to remove. Foreign/missing IDs return identical 404. Full SKU identity is retained. Owner lock serializes updates with add/delete/clear/checkout; last serialized update wins. Returns the updated line with live unitPrice and lineTotal; GET cart returns aggregate totals. Invalid existing cart returns 422. Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart. Same router and semantics as /api/shopping-cart/items/{id}; new clients should use canonical lowercase.
         */
        patch: operations["updateCartItemLegacy"];
        trace?: never;
    };
    "/api/shopping-cart/fake-shopping-cart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read public synthetic cart demo
         * @description Deterministic original demo, no real user/catalog data, null IDs and available:false. Never purchasable.
         */
        get: operations["cartDemo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/ShoppingCart/fake-shopping-cart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read public synthetic cart demo (legacy casing alias)
         * @description Deterministic original demo, no real user/catalog data, null IDs and available:false. Never purchasable. Same router and semantics as /api/shopping-cart/fake-shopping-cart; new clients should use canonical lowercase.
         */
        get: operations["cartDemoLegacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/shopping-cart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read own persisted cart
         * @description Owner comes from the authenticated UUID. Current-price display estimates include unavailable lines; an empty cart is not written to DB. Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart.
         */
        get: operations["cart"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/ShoppingCart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read own persisted cart (legacy casing alias)
         * @description Owner comes from the authenticated UUID. Current-price display estimates include unavailable lines; an empty cart is not written to DB. Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart. Same router and semantics as /api/shopping-cart; new clients should use canonical lowercase.
         */
        get: operations["cartLegacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/shopping-cart/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add or merge an owned full-SKU cart line
         * @description Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart. Merge only the full product/model/memory/color key. New line 201, merge 200. All selected options must belong to the product and be available.
         */
        post: operations["addCartItem"];
        /**
         * Clear own cart
         * @description Idempotently deletes only owned lines; preserves the reusable Cart row. 204 has no response body.
         */
        delete: operations["clearCart"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/ShoppingCart/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add or merge an owned full-SKU cart line (legacy casing alias)
         * @description Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart. Merge only the full product/model/memory/color key. New line 201, merge 200. All selected options must belong to the product and be available. Same router and semantics as /api/shopping-cart/items; new clients should use canonical lowercase.
         */
        post: operations["addCartItemLegacy"];
        /**
         * Clear own cart (legacy casing alias)
         * @description Idempotently deletes only owned lines; preserves the reusable Cart row. 204 has no response body. Same router and semantics as /api/shopping-cart/items; new clients should use canonical lowercase.
         */
        delete: operations["clearCartLegacy"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/orders/place": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Atomically place an order
         * @description JSON {} purchases the CURRENT USER persisted cart. Direct full-SKU body is optional compatibility mode and leaves the cart unchanged. Live full ProductModel.price + ProductMemorySize.extraPrice, using Decimal; startingPrice is never added. CNY amounts are fixed two-decimal strings. Legacy names/images/prices are bounded and discarded. Limits: 99 units/line, 50 configurations and 500 units/cart. One Read Committed PostgreSQL transaction owner-locks, revalidates/reprices, creates pending order/items/history/receipt and consumes purchased cart lines atomically. Optional Idempotency-Key: 1–128 ASCII characters; duplicates rejected; per-user unique key and persisted SHA-256 fingerprint. Replay is checked BEFORE empty/stock checks and returns the exact prior creation receipt with 200 even after cart refill/status change. First create 201. Changed direct payload/mode with same key 409. Cart fingerprint denotes the purchase intent, not mutable contents; use a new key for a new purchase. Keyless direct requests lack replay guarantees. P2034 serialization/deadlock retries: max 3 attempts with 20/40ms waits; exhausted 503 CHECKOUT_BUSY. No inventory reservation, tax/shipping/payment or client totals.
         */
        post: operations["place"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List own orders
         * @description Own orders only, even for ADMIN. Owner/time/ID or global time/ID indexed cursor pagination. newest = createdAt DESC,id DESC; oldest reverses both. pageSize defaults to 20, max 100. Cursor is an opaque versioned position, max 256 characters, reused with the same sort; never an authorization credential. No page/offset/count/search parameters. Each response uses one Repeatable Read snapshot.
         */
        get: operations["ownOrders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/orders/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read owned order or ADMIN-visible order
         * @description Owner or ADMIN. Foreign USER and missing ID return identical ORDER_NOT_FOUND. Current state, immutable purchase snapshots and ordered status history; no account relation or internal receipt metadata. P07 placement replay remains the original pending receipt.
         */
        get: operations["order"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/orders/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve a pending order (ADMIN)
         * @description ADMIN only, with transaction-time role recheck under an operator share lock. Only pending -> approved or pending -> rejected; terminal states cannot change. A conditional PostgreSQL UPDATE and initial-to-terminal history insertion commit atomically. Opposite concurrent decisions yield one 200 and one 409. Immutable snapshots and the P07 creation receipt are preserved. No payments or payment URI. Optional metadata is a trimmed plain {note} (raw <=1000, normalized 1–500, no controls); a deprecated string becomes a note and is never parsed as JSON.
         */
        post: operations["approve"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/orders/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject a pending order (ADMIN)
         * @description ADMIN only, with transaction-time role recheck under an operator share lock. Only pending -> approved or pending -> rejected; terminal states cannot change. A conditional PostgreSQL UPDATE and initial-to-terminal history insertion commit atomically. Opposite concurrent decisions yield one 200 and one 409. Immutable snapshots and the P07 creation receipt are preserved. No payments or payment URI. Optional metadata is a trimmed plain {note} (raw <=1000, normalized 1–500, no controls); a deprecated string becomes a note and is never parsed as JSON.
         */
        post: operations["reject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all orders (ADMIN)
         * @description ADMIN only, across owners. Owner/time/ID or global time/ID indexed cursor pagination. newest = createdAt DESC,id DESC; oldest reverses both. pageSize defaults to 20, max 100. Cursor is an opaque versioned position, max 256 characters, reused with the same sort; never an authorization credential. No page/offset/count/search parameters. Each response uses one Repeatable Read snapshot.
         */
        get: operations["adminOrders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Process liveness
         * @description Process-only check, independent of DB/auth readiness.
         */
        get: operations["health"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Bounded database readiness
         * @description Real bounded SELECT 1. Missing/unavailable DB returns 503, never false success. Connectivity only, not migration/auth/catalog readiness.
         */
        get: operations["ready"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/docs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Local Swagger UI
         * @description HTML documentation using local assets. Spec loading and UI initialization do not call business routes. External validation and persisted authorization are disabled.
         */
        get: operations["docs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/docs/openapi.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Raw OpenAPI 3.1 specification
         * @description Raw OpenAPI document, intentionally outside the application response envelope.
         */
        get: operations["spec"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/media/demo-placeholder.svg": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Reviewed local placeholder image
         * @description Original SVG file only. Standard HEAD/conditional responses may be bodyless; static assets are outside the API JSON envelope.
         */
        get: operations["media"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
         * @example 10.10
         */
        Money: string;
        ErrorEnvelope: {
            /** @constant */
            success: false;
            error: {
                code: string;
                message: string;
                details: null | {
                    path: (string | number)[];
                    code: string;
                }[] | {
                    /** @enum {string} */
                    database: "not_configured" | "unavailable";
                };
            };
        };
        offersResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                productId: number | null;
                type: string;
                title: string;
                detail: string;
                image: string;
                soldOut: boolean;
            }[];
            meta: null;
        };
        arrivalsResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                productId: number | null;
                title: string;
                detail: string;
                image: string;
                soldOut: boolean;
                textColor: string;
            }[];
            meta: null;
        };
        productsResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                name: string;
                title: string;
                image: string;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                startingPrice: string;
                installments: string | null;
                features: string[];
                inStock: boolean;
                category: string | null;
                carouselImages: string[];
                models: {
                    id: number;
                    name: string;
                    specification: string;
                    /**
                     * @description Complete model base price; do not add startingPrice.
                     * @example 10.10
                     */
                    price: string;
                    inStock: boolean;
                }[];
                memorySizes: {
                    id: number;
                    name: string;
                    /**
                     * @description Incremental memory upgrade price, added to the full model base.
                     * @example 10.10
                     */
                    price: string;
                    inStock: boolean;
                }[];
                colors: string[];
            }[];
            meta: {
                page: number;
                pageSize: number;
                total: number;
                totalPages: number;
            };
        };
        productResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                name: string;
                title: string;
                image: string;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                startingPrice: string;
                installments: string | null;
                features: string[];
                inStock: boolean;
                category: string | null;
                carouselImages: string[];
                models: {
                    id: number;
                    name: string;
                    specification: string;
                    /**
                     * @description Complete model base price; do not add startingPrice.
                     * @example 10.10
                     */
                    price: string;
                    inStock: boolean;
                }[];
                memorySizes: {
                    id: number;
                    name: string;
                    /**
                     * @description Incremental memory upgrade price, added to the full model base.
                     * @example 10.10
                     */
                    price: string;
                    inStock: boolean;
                }[];
                colors: string[];
            };
            meta: null;
        };
        categoriesResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                title: string;
                slug: string;
                subTitle: string | null;
            }[];
            meta: null;
        };
        categoryResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                title: string;
                slug: string;
                subTitle: string | null;
                videos: {
                    id: number;
                    regularSrc: string | null;
                    smallSrc: string | null;
                } | null;
                features: {
                    id: number;
                    title: string;
                    detail: string;
                    image: string;
                    /** @enum {string} */
                    textColor: "black" | "white";
                }[];
                products: {
                    id: number;
                    name: string;
                    title: string;
                    image: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    startingPrice: string;
                    installments: string | null;
                    features: string[];
                    inStock: boolean;
                }[];
            };
            meta: null;
        };
        supportResponse200: {
            /** @constant */
            success: true;
            data: {
                /** @description Reviewed support HTML sanitized on read with a tag allowlist and no attributes/links. Render defensively. */
                html: string;
                locale: string;
            };
            meta: null;
        };
        registerResponse201: {
            /** @constant */
            success: true;
            data: {
                /** Format: uuid */
                id: string;
                username: string;
                email: string;
                /** @enum {string} */
                role: "USER" | "ADMIN";
                /** Format: date-time */
                createdAt: string;
            };
            meta: {
                deprecatedFields: string[];
            } | null;
        };
        /** @description Exactly one matching confirmation is required. Synthetic examples are not provisioned accounts. */
        registerRequest: {
            /** @description Trimmed and lowercased; normalized ASCII username is 3–32 letters/digits/dot/underscore/hyphen, starting with a letter or digit. */
            username: string;
            /** @description Required valid ASCII email after trimming/lowercasing, at most 254 normalized characters. Legacy registration without email is rejected. */
            email: string;
            password: string;
            /** @description Must exactly match password. Provide exactly one confirmation field. */
            confirmPassword?: string;
            /**
             * @deprecated
             * @description Deprecated casing alias; use confirmPassword. Supply exactly one alias and match password.
             */
            ConfirmPassword?: string;
        } & (unknown | unknown);
        loginResponse200: {
            /** @constant */
            success: true;
            data: {
                user: {
                    /** Format: uuid */
                    id: string;
                    username: string;
                    email: string;
                    /** @enum {string} */
                    role: "USER" | "ADMIN";
                    /** Format: date-time */
                    createdAt: string;
                };
                /** @description Issued HS256 JWT. Examples use a placeholder only. */
                token: string;
                /** @constant */
                tokenType: "Bearer";
                expiresIn: number;
                /** Format: date-time */
                expiresAt: string;
            };
            meta: {
                deprecatedFields: string[];
            } | null;
        };
        loginRequest: {
            identifier?: string;
            /**
             * @deprecated
             * @description Deprecated alias for identifier. Supply exactly one.
             */
            username?: string;
            password: string;
        } & (unknown | unknown);
        meResponse200: {
            /** @constant */
            success: true;
            data: {
                /** Format: uuid */
                id: string;
                username: string;
                email: string;
                /** @enum {string} */
                role: "USER" | "ADMIN";
                /** Format: date-time */
                createdAt: string;
            };
            meta: null;
        };
        updateCartItemResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                product: {
                    id: number;
                    name: string;
                    image: string;
                };
                model: {
                    id: number;
                    name: string;
                    specification: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    price: string;
                };
                memorySize: {
                    id: number;
                    name: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    price: string;
                };
                color: string;
                qty: number;
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                unitPrice: string;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                lineTotal: string;
                available: boolean;
            };
            meta: null;
        };
        updateCartItemRequest: {
            qty: number;
        };
        cartDemoResponse200: {
            /** @constant */
            success: true;
            data: {
                id: null;
                /** @constant */
                isDemo: true;
                /** @constant */
                currency: "CNY";
                items: {
                    id: null;
                    product: {
                        id: null;
                        name: string;
                        image: string;
                    };
                    model: {
                        id: null;
                        name: string;
                        specification: string;
                        /**
                         * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                         * @example 10.10
                         */
                        price: string;
                    };
                    memorySize: {
                        id: null;
                        name: string;
                        /**
                         * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                         * @example 10.10
                         */
                        price: string;
                    };
                    color: string;
                    qty: number;
                    /** @constant */
                    currency: "CNY";
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                    /** @constant */
                    available: false;
                }[];
                itemCount: number;
                totalQty: number;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
            };
            meta: null;
        };
        cartResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number | null;
                /** @constant */
                isDemo: false;
                /** @constant */
                currency: "CNY";
                items: {
                    id: number;
                    product: {
                        id: number;
                        name: string;
                        image: string;
                    };
                    model: {
                        id: number;
                        name: string;
                        specification: string;
                        /**
                         * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                         * @example 10.10
                         */
                        price: string;
                    };
                    memorySize: {
                        id: number;
                        name: string;
                        /**
                         * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                         * @example 10.10
                         */
                        price: string;
                    };
                    color: string;
                    qty: number;
                    /** @constant */
                    currency: "CNY";
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                    available: boolean;
                }[];
                itemCount: number;
                totalQty: number;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
            };
            meta: null;
        };
        addCartItemResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                product: {
                    id: number;
                    name: string;
                    image: string;
                };
                model: {
                    id: number;
                    name: string;
                    specification: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    price: string;
                };
                memorySize: {
                    id: number;
                    name: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    price: string;
                };
                color: string;
                qty: number;
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                unitPrice: string;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                lineTotal: string;
                available: boolean;
            };
            meta: {
                deprecatedFields: string[];
            } | null;
        };
        addCartItemResponse201: {
            /** @constant */
            success: true;
            data: {
                id: number;
                product: {
                    id: number;
                    name: string;
                    image: string;
                };
                model: {
                    id: number;
                    name: string;
                    specification: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    price: string;
                };
                memorySize: {
                    id: number;
                    name: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    price: string;
                };
                color: string;
                qty: number;
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                unitPrice: string;
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                lineTotal: string;
                available: boolean;
            };
            meta: {
                deprecatedFields: string[];
            } | null;
        };
        addCartItemRequest: {
            productId: number;
            modelId: number;
            memorySizeId: number;
            color: string;
            qty: number;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            name?: string;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            imageSrc?: string;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            model?: string;
            /**
             * @deprecated
             * @description Migration-only untrusted client price. Discarded; live model base plus memory increment is authoritative.
             */
            modelPrice?: string | number;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            memorySize?: string;
            /**
             * @deprecated
             * @description Migration-only untrusted client price. Discarded; live model base plus memory increment is authoritative.
             */
            memorySizePrice?: string | number;
        };
        removeCartItemRequest: Record<string, never>;
        clearCartRequest: Record<string, never>;
        placeResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** @constant */
                status: "pending";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                items: {
                    id: number;
                    productId: number;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
            };
            meta: null;
        };
        placeResponse201: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** @constant */
                status: "pending";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                items: {
                    id: number;
                    productId: number;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
            };
            meta: null;
        };
        placeRequest: Record<string, never> | {
            productId: number;
            modelId: number;
            memorySizeId: number;
            color: string;
            qty: number;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            name?: string;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            imageSrc?: string;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            model?: string;
            /**
             * @deprecated
             * @description Migration-only untrusted client price. Discarded; live model base plus memory increment is authoritative.
             */
            modelPrice?: string | number;
            /**
             * @deprecated
             * @description Migration-only display field. Bounded, discarded and never used as authority.
             */
            memorySize?: string;
            /**
             * @deprecated
             * @description Migration-only untrusted client price. Discarded; live model base plus memory increment is authoritative.
             */
            memorySizePrice?: string | number;
        };
        ownOrdersResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** Format: uuid */
                userId: string;
                /** @enum {string} */
                status: "pending" | "approved" | "rejected";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                items: {
                    id: number;
                    productId: number | null;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
                statusHistory: {
                    id: number;
                    fromStatus: ("pending" | "approved" | "rejected") | null;
                    /** @enum {string} */
                    toStatus: "pending" | "approved" | "rejected";
                    /** Format: uuid */
                    operatorId: string;
                    /** Format: date-time */
                    createdAt: string;
                    metadata: {
                        note: string;
                    } | null;
                }[];
            }[];
            meta: {
                pageSize: number;
                /** @enum {string} */
                sort: "newest" | "oldest";
                hasMore: boolean;
                nextCursor: string | null;
            };
        };
        orderResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** Format: uuid */
                userId: string;
                /** @enum {string} */
                status: "pending" | "approved" | "rejected";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                items: {
                    id: number;
                    productId: number | null;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
                statusHistory: {
                    id: number;
                    fromStatus: ("pending" | "approved" | "rejected") | null;
                    /** @enum {string} */
                    toStatus: "pending" | "approved" | "rejected";
                    /** Format: uuid */
                    operatorId: string;
                    /** Format: date-time */
                    createdAt: string;
                    metadata: {
                        note: string;
                    } | null;
                }[];
            };
            meta: null;
        };
        approveResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** Format: uuid */
                userId: string;
                /** @enum {string} */
                status: "pending" | "approved" | "rejected";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                items: {
                    id: number;
                    productId: number | null;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
                statusHistory: {
                    id: number;
                    fromStatus: ("pending" | "approved" | "rejected") | null;
                    /** @enum {string} */
                    toStatus: "pending" | "approved" | "rejected";
                    /** Format: uuid */
                    operatorId: string;
                    /** Format: date-time */
                    createdAt: string;
                    metadata: {
                        note: string;
                    } | null;
                }[];
            };
            meta: {
                deprecatedFields: string[];
            } | null;
        };
        approveRequest: {
            metadata?: {
                note: string;
            } | string;
        };
        rejectResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** Format: uuid */
                userId: string;
                /** @enum {string} */
                status: "pending" | "approved" | "rejected";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                items: {
                    id: number;
                    productId: number | null;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
                statusHistory: {
                    id: number;
                    fromStatus: ("pending" | "approved" | "rejected") | null;
                    /** @enum {string} */
                    toStatus: "pending" | "approved" | "rejected";
                    /** Format: uuid */
                    operatorId: string;
                    /** Format: date-time */
                    createdAt: string;
                    metadata: {
                        note: string;
                    } | null;
                }[];
            };
            meta: {
                deprecatedFields: string[];
            } | null;
        };
        rejectRequest: {
            metadata?: {
                note: string;
            } | string;
        };
        adminOrdersResponse200: {
            /** @constant */
            success: true;
            data: {
                id: number;
                /** Format: uuid */
                userId: string;
                /** @enum {string} */
                status: "pending" | "approved" | "rejected";
                /** @constant */
                currency: "CNY";
                /**
                 * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                 * @example 10.10
                 */
                totalAmount: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                items: {
                    id: number;
                    productId: number | null;
                    productName: string;
                    modelName: string;
                    modelSpecification: string;
                    memoryName: string;
                    color: string;
                    qty: number;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    unitPrice: string;
                    /**
                     * @description CNY decimal amount serialized as a fixed two-decimal JSON STRING. Never a JSON number.
                     * @example 10.10
                     */
                    lineTotal: string;
                }[];
                statusHistory: {
                    id: number;
                    fromStatus: ("pending" | "approved" | "rejected") | null;
                    /** @enum {string} */
                    toStatus: "pending" | "approved" | "rejected";
                    /** Format: uuid */
                    operatorId: string;
                    /** Format: date-time */
                    createdAt: string;
                    metadata: {
                        note: string;
                    } | null;
                }[];
            }[];
            meta: {
                pageSize: number;
                /** @enum {string} */
                sort: "newest" | "oldest";
                hasMore: boolean;
                nextCursor: string | null;
            };
        };
        healthResponse200: {
            /** @constant */
            success: true;
            data: {
                /** @constant */
                status: "ok";
            };
            meta: null;
        };
        readyResponse200: {
            /** @constant */
            success: true;
            data: {
                /** @constant */
                status: "ready";
                /** @constant */
                database: "up";
            };
            meta: null;
        };
        docsResponse200: string;
        specResponse200: {
            /** @constant */
            openapi: "3.1.0";
        } & {
            [key: string]: unknown;
        };
        mediaResponse200: string;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    offers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": [],
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["offersResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    arrivals: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": [],
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["arrivalsResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    products: {
        parameters: {
            query?: {
                /**
                 * @description Trimmed literal case-insensitive search, raw <=200/normalized <=100, no controls.
                 * @example demo
                 */
                keyword?: string;
                /**
                 * @description Case-insensitive title or slug, same length caps; blank invalid.
                 * @example Phones
                 */
                category?: string;
                /** @description Plain positive decimal integer, maximum 10000, default 1. No signs, leading zeros, fractions or repeated values. */
                page?: string;
                /** @description Plain positive decimal integer, maximum 100, default 20. No signs, leading zeros, fractions or repeated values. */
                pageSize?: string;
                sort?: "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": [],
                     *       "meta": {
                     *         "page": 1,
                     *         "pageSize": 20,
                     *         "total": 0,
                     *         "totalPages": 0
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["productsResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    product: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 2,
                     *         "name": "Synthetic example device",
                     *         "title": "Illustrative product, not a fixture",
                     *         "image": "/media/demo-placeholder.svg",
                     *         "startingPrice": "100.00",
                     *         "installments": null,
                     *         "features": [],
                     *         "inStock": true,
                     *         "category": "Phones",
                     *         "carouselImages": [],
                     *         "models": [
                     *           {
                     *             "id": 1,
                     *             "name": "Example full base",
                     *             "specification": "Synthetic specification",
                     *             "price": "100.00",
                     *             "inStock": true
                     *           }
                     *         ],
                     *         "memorySizes": [
                     *           {
                     *             "id": 1,
                     *             "name": "Example upgrade",
                     *             "price": "20.00",
                     *             "inStock": true
                     *           }
                     *         ],
                     *         "colors": [
                     *           "Silver"
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["productResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PRODUCT_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PRODUCT_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    categories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": [],
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["categoriesResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    category: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description URL-encode title once; slug is also accepted.
                 * @example Phones
                 */
                title: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "title": "Phones",
                     *         "slug": "phones",
                     *         "subTitle": null,
                     *         "videos": null,
                     *         "features": [],
                     *         "products": []
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["categoryResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CATEGORY_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CATEGORY_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    support: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "html": "<section><h1>Demo support</h1><p>Original synthetic example.</p></section>",
                     *         "locale": "zh-CN"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["supportResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INFORMATION_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INFORMATION_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "username": "synthetic_demo_user",
                 *       "email": "synthetic@example.test",
                 *       "password": "Synthetic-example-ChangeMe-2026!",
                 *       "confirmPassword": "Synthetic-example-ChangeMe-2026!"
                 *     }
                 */
                "application/json": components["schemas"]["registerRequest"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": "00000000-0000-4000-8000-000000000001",
                     *         "username": "synthetic_demo_user",
                     *         "email": "synthetic@example.test",
                     *         "role": "USER",
                     *         "createdAt": "2026-01-01T00:00:00.000Z"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["registerResponse201"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ACCOUNT_CONFLICT */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "ACCOUNT_CONFLICT",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "identifier": "synthetic_demo_user",
                 *       "password": "Synthetic-example-ChangeMe-2026!"
                 *     }
                 */
                "application/json": components["schemas"]["loginRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "user": {
                     *           "id": "00000000-0000-4000-8000-000000000001",
                     *           "username": "synthetic_demo_user",
                     *           "email": "synthetic@example.test",
                     *           "role": "USER",
                     *           "createdAt": "2026-01-01T00:00:00.000Z"
                     *         },
                     *         "token": "{{accessToken}}",
                     *         "tokenType": "Bearer",
                     *         "expiresIn": 900,
                     *         "expiresAt": "2026-01-01T00:00:00.000Z"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["loginResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": "00000000-0000-4000-8000-000000000001",
                     *         "username": "synthetic_demo_user",
                     *         "email": "synthetic@example.test",
                     *         "role": "USER",
                     *         "createdAt": "2026-01-01T00:00:00.000Z"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["meResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    removeCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["removeCartItemRequest"];
            };
        };
        responses: {
            /** @description Success; no response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CART_ITEM_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CART_ITEM_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    updateCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "qty": 2
                 *     }
                 */
                "application/json": components["schemas"]["updateCartItemRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "product": {
                     *           "id": 2,
                     *           "name": "Synthetic example device",
                     *           "image": "/media/demo-placeholder.svg"
                     *         },
                     *         "model": {
                     *           "id": 1,
                     *           "name": "Example full base",
                     *           "specification": "Synthetic specification",
                     *           "price": "100.00"
                     *         },
                     *         "memorySize": {
                     *           "id": 1,
                     *           "name": "Example upgrade",
                     *           "price": "20.00"
                     *         },
                     *         "color": "Silver",
                     *         "qty": 2,
                     *         "currency": "CNY",
                     *         "unitPrice": "120.00",
                     *         "lineTotal": "240.00",
                     *         "available": true
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["updateCartItemResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CART_ITEM_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CART_ITEM_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INVALID_CART | INVALID_PRODUCT_CONFIGURATION | PRODUCT_UNAVAILABLE | CART_LIMIT_EXCEEDED */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INVALID_CART",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    removeCartItemLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["removeCartItemRequest"];
            };
        };
        responses: {
            /** @description Success; no response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CART_ITEM_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CART_ITEM_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    updateCartItemLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "qty": 2
                 *     }
                 */
                "application/json": components["schemas"]["updateCartItemRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "product": {
                     *           "id": 2,
                     *           "name": "Synthetic example device",
                     *           "image": "/media/demo-placeholder.svg"
                     *         },
                     *         "model": {
                     *           "id": 1,
                     *           "name": "Example full base",
                     *           "specification": "Synthetic specification",
                     *           "price": "100.00"
                     *         },
                     *         "memorySize": {
                     *           "id": 1,
                     *           "name": "Example upgrade",
                     *           "price": "20.00"
                     *         },
                     *         "color": "Silver",
                     *         "qty": 2,
                     *         "currency": "CNY",
                     *         "unitPrice": "120.00",
                     *         "lineTotal": "240.00",
                     *         "available": true
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["updateCartItemResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CART_ITEM_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CART_ITEM_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INVALID_CART | INVALID_PRODUCT_CONFIGURATION | PRODUCT_UNAVAILABLE | CART_LIMIT_EXCEEDED */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INVALID_CART",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    cartDemo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": null,
                     *         "isDemo": true,
                     *         "currency": "CNY",
                     *         "itemCount": 1,
                     *         "totalQty": 2,
                     *         "totalAmount": "240.00",
                     *         "items": [
                     *           {
                     *             "id": null,
                     *             "product": {
                     *               "id": null,
                     *               "name": "Synthetic demo device",
                     *               "image": "/media/demo-placeholder.svg"
                     *             },
                     *             "model": {
                     *               "id": null,
                     *               "name": "Demo base model",
                     *               "specification": "Synthetic example; not a sellable configuration",
                     *               "price": "100.00"
                     *             },
                     *             "memorySize": {
                     *               "id": null,
                     *               "name": "Demo memory upgrade",
                     *               "price": "20.00"
                     *             },
                     *             "color": "Demo silver",
                     *             "qty": 2,
                     *             "currency": "CNY",
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00",
                     *             "available": false
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["cartDemoResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    cartDemoLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": null,
                     *         "isDemo": true,
                     *         "currency": "CNY",
                     *         "itemCount": 1,
                     *         "totalQty": 2,
                     *         "totalAmount": "240.00",
                     *         "items": [
                     *           {
                     *             "id": null,
                     *             "product": {
                     *               "id": null,
                     *               "name": "Synthetic demo device",
                     *               "image": "/media/demo-placeholder.svg"
                     *             },
                     *             "model": {
                     *               "id": null,
                     *               "name": "Demo base model",
                     *               "specification": "Synthetic example; not a sellable configuration",
                     *               "price": "100.00"
                     *             },
                     *             "memorySize": {
                     *               "id": null,
                     *               "name": "Demo memory upgrade",
                     *               "price": "20.00"
                     *             },
                     *             "color": "Demo silver",
                     *             "qty": 2,
                     *             "currency": "CNY",
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00",
                     *             "available": false
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["cartDemoResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    cart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "isDemo": false,
                     *         "currency": "CNY",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "product": {
                     *               "id": 2,
                     *               "name": "Synthetic example device",
                     *               "image": "/media/demo-placeholder.svg"
                     *             },
                     *             "model": {
                     *               "id": 1,
                     *               "name": "Example full base",
                     *               "specification": "Synthetic specification",
                     *               "price": "100.00"
                     *             },
                     *             "memorySize": {
                     *               "id": 1,
                     *               "name": "Example upgrade",
                     *               "price": "20.00"
                     *             },
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "currency": "CNY",
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00",
                     *             "available": true
                     *           }
                     *         ],
                     *         "itemCount": 1,
                     *         "totalQty": 2,
                     *         "totalAmount": "240.00"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["cartResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    cartLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "isDemo": false,
                     *         "currency": "CNY",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "product": {
                     *               "id": 2,
                     *               "name": "Synthetic example device",
                     *               "image": "/media/demo-placeholder.svg"
                     *             },
                     *             "model": {
                     *               "id": 1,
                     *               "name": "Example full base",
                     *               "specification": "Synthetic specification",
                     *               "price": "100.00"
                     *             },
                     *             "memorySize": {
                     *               "id": 1,
                     *               "name": "Example upgrade",
                     *               "price": "20.00"
                     *             },
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "currency": "CNY",
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00",
                     *             "available": true
                     *           }
                     *         ],
                     *         "itemCount": 1,
                     *         "totalQty": 2,
                     *         "totalAmount": "240.00"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["cartResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    addCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "productId": 2,
                 *       "modelId": 1,
                 *       "memorySizeId": 1,
                 *       "color": "Silver",
                 *       "qty": 1
                 *     }
                 */
                "application/json": components["schemas"]["addCartItemRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "product": {
                     *           "id": 2,
                     *           "name": "Synthetic example device",
                     *           "image": "/media/demo-placeholder.svg"
                     *         },
                     *         "model": {
                     *           "id": 1,
                     *           "name": "Example full base",
                     *           "specification": "Synthetic specification",
                     *           "price": "100.00"
                     *         },
                     *         "memorySize": {
                     *           "id": 1,
                     *           "name": "Example upgrade",
                     *           "price": "20.00"
                     *         },
                     *         "color": "Silver",
                     *         "qty": 2,
                     *         "currency": "CNY",
                     *         "unitPrice": "120.00",
                     *         "lineTotal": "240.00",
                     *         "available": true
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["addCartItemResponse200"];
                };
            };
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "product": {
                     *           "id": 2,
                     *           "name": "Synthetic example device",
                     *           "image": "/media/demo-placeholder.svg"
                     *         },
                     *         "model": {
                     *           "id": 1,
                     *           "name": "Example full base",
                     *           "specification": "Synthetic specification",
                     *           "price": "100.00"
                     *         },
                     *         "memorySize": {
                     *           "id": 1,
                     *           "name": "Example upgrade",
                     *           "price": "20.00"
                     *         },
                     *         "color": "Silver",
                     *         "qty": 2,
                     *         "currency": "CNY",
                     *         "unitPrice": "120.00",
                     *         "lineTotal": "240.00",
                     *         "available": true
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["addCartItemResponse201"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PRODUCT_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PRODUCT_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INVALID_PRODUCT_CONFIGURATION | PRODUCT_UNAVAILABLE | CART_LIMIT_EXCEEDED */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INVALID_PRODUCT_CONFIGURATION",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    clearCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["clearCartRequest"];
            };
        };
        responses: {
            /** @description Success; no response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    addCartItemLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "productId": 2,
                 *       "modelId": 1,
                 *       "memorySizeId": 1,
                 *       "color": "Silver",
                 *       "qty": 1
                 *     }
                 */
                "application/json": components["schemas"]["addCartItemRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "product": {
                     *           "id": 2,
                     *           "name": "Synthetic example device",
                     *           "image": "/media/demo-placeholder.svg"
                     *         },
                     *         "model": {
                     *           "id": 1,
                     *           "name": "Example full base",
                     *           "specification": "Synthetic specification",
                     *           "price": "100.00"
                     *         },
                     *         "memorySize": {
                     *           "id": 1,
                     *           "name": "Example upgrade",
                     *           "price": "20.00"
                     *         },
                     *         "color": "Silver",
                     *         "qty": 2,
                     *         "currency": "CNY",
                     *         "unitPrice": "120.00",
                     *         "lineTotal": "240.00",
                     *         "available": true
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["addCartItemResponse200"];
                };
            };
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "product": {
                     *           "id": 2,
                     *           "name": "Synthetic example device",
                     *           "image": "/media/demo-placeholder.svg"
                     *         },
                     *         "model": {
                     *           "id": 1,
                     *           "name": "Example full base",
                     *           "specification": "Synthetic specification",
                     *           "price": "100.00"
                     *         },
                     *         "memorySize": {
                     *           "id": 1,
                     *           "name": "Example upgrade",
                     *           "price": "20.00"
                     *         },
                     *         "color": "Silver",
                     *         "qty": 2,
                     *         "currency": "CNY",
                     *         "unitPrice": "120.00",
                     *         "lineTotal": "240.00",
                     *         "available": true
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["addCartItemResponse201"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PRODUCT_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PRODUCT_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INVALID_PRODUCT_CONFIGURATION | PRODUCT_UNAVAILABLE | CART_LIMIT_EXCEEDED */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INVALID_PRODUCT_CONFIGURATION",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    clearCartLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["clearCartRequest"];
            };
        };
        responses: {
            /** @description Success; no response body */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    place: {
        parameters: {
            query?: never;
            header?: {
                /**
                 * @description Optional case-sensitive purchase-intent key. Header name case-insensitive. Pattern: ^[A-Za-z0-9][A-Za-z0-9._:-]*$, length 1–128; repeated headers rejected.
                 * @example synthetic-checkout-001
                 */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /** @example {} */
                "application/json": components["schemas"]["placeRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "status": "pending",
                     *         "currency": "CNY",
                     *         "totalAmount": "240.00",
                     *         "createdAt": "2026-01-01T00:00:00.000Z",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "productId": 2,
                     *             "productName": "Synthetic example device",
                     *             "modelName": "Example full base",
                     *             "modelSpecification": "Synthetic specification",
                     *             "memoryName": "Example upgrade",
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00"
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["placeResponse200"];
                };
            };
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "status": "pending",
                     *         "currency": "CNY",
                     *         "totalAmount": "240.00",
                     *         "createdAt": "2026-01-01T00:00:00.000Z",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "productId": 2,
                     *             "productName": "Synthetic example device",
                     *             "modelName": "Example full base",
                     *             "modelSpecification": "Synthetic specification",
                     *             "memoryName": "Example upgrade",
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00"
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["placeResponse201"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description IDEMPOTENCY_CONFLICT */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "IDEMPOTENCY_CONFLICT",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description EMPTY_CART | INVALID_CART | INVALID_PRODUCT_CONFIGURATION | PRODUCT_UNAVAILABLE | ORDER_AMOUNT_EXCEEDED */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "EMPTY_CART",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY | CHECKOUT_BUSY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    ownOrders: {
        parameters: {
            query?: {
                /** @description Plain positive decimal integer, maximum 100, default 20. No repeated values. */
                pageSize?: string;
                sort?: "newest" | "oldest";
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": [],
                     *       "meta": {
                     *         "pageSize": 20,
                     *         "sort": "newest",
                     *         "hasMore": false,
                     *         "nextCursor": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ownOrdersResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    order: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "status": "pending",
                     *         "currency": "CNY",
                     *         "totalAmount": "240.00",
                     *         "createdAt": "2026-01-01T00:00:00.000Z",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "productId": 2,
                     *             "productName": "Synthetic example device",
                     *             "modelName": "Example full base",
                     *             "modelSpecification": "Synthetic specification",
                     *             "memoryName": "Example upgrade",
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00"
                     *           }
                     *         ],
                     *         "userId": "00000000-0000-4000-8000-000000000001",
                     *         "updatedAt": "2026-01-01T00:00:00.000Z",
                     *         "statusHistory": [
                     *           {
                     *             "id": 1,
                     *             "fromStatus": null,
                     *             "toStatus": "pending",
                     *             "operatorId": "00000000-0000-4000-8000-000000000001",
                     *             "createdAt": "2026-01-01T00:00:00.000Z",
                     *             "metadata": null
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["orderResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ORDER_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "ORDER_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    approve: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "metadata": {
                 *         "note": "Synthetic operator review example"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["approveRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "status": "approved",
                     *         "currency": "CNY",
                     *         "totalAmount": "240.00",
                     *         "createdAt": "2026-01-01T00:00:00.000Z",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "productId": 2,
                     *             "productName": "Synthetic example device",
                     *             "modelName": "Example full base",
                     *             "modelSpecification": "Synthetic specification",
                     *             "memoryName": "Example upgrade",
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00"
                     *           }
                     *         ],
                     *         "userId": "00000000-0000-4000-8000-000000000001",
                     *         "updatedAt": "2026-01-01T00:00:00.000Z",
                     *         "statusHistory": [
                     *           {
                     *             "id": 1,
                     *             "fromStatus": null,
                     *             "toStatus": "pending",
                     *             "operatorId": "00000000-0000-4000-8000-000000000001",
                     *             "createdAt": "2026-01-01T00:00:00.000Z",
                     *             "metadata": null
                     *           },
                     *           {
                     *             "id": 2,
                     *             "fromStatus": "pending",
                     *             "toStatus": "approved",
                     *             "operatorId": "00000000-0000-4000-8000-000000000002",
                     *             "createdAt": "2026-01-01T00:00:00.000Z",
                     *             "metadata": {
                     *               "note": "Synthetic review example"
                     *             }
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["approveResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED | FORBIDDEN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ORDER_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "ORDER_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ORDER_INVALID_TRANSITION */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "ORDER_INVALID_TRANSITION",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    reject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "metadata": {
                 *         "note": "Synthetic operator review example"
                 *       }
                 *     }
                 */
                "application/json": components["schemas"]["rejectRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "id": 1,
                     *         "status": "rejected",
                     *         "currency": "CNY",
                     *         "totalAmount": "240.00",
                     *         "createdAt": "2026-01-01T00:00:00.000Z",
                     *         "items": [
                     *           {
                     *             "id": 1,
                     *             "productId": 2,
                     *             "productName": "Synthetic example device",
                     *             "modelName": "Example full base",
                     *             "modelSpecification": "Synthetic specification",
                     *             "memoryName": "Example upgrade",
                     *             "color": "Silver",
                     *             "qty": 2,
                     *             "unitPrice": "120.00",
                     *             "lineTotal": "240.00"
                     *           }
                     *         ],
                     *         "userId": "00000000-0000-4000-8000-000000000001",
                     *         "updatedAt": "2026-01-01T00:00:00.000Z",
                     *         "statusHistory": [
                     *           {
                     *             "id": 1,
                     *             "fromStatus": null,
                     *             "toStatus": "pending",
                     *             "operatorId": "00000000-0000-4000-8000-000000000001",
                     *             "createdAt": "2026-01-01T00:00:00.000Z",
                     *             "metadata": null
                     *           },
                     *           {
                     *             "id": 2,
                     *             "fromStatus": "pending",
                     *             "toStatus": "rejected",
                     *             "operatorId": "00000000-0000-4000-8000-000000000002",
                     *             "createdAt": "2026-01-01T00:00:00.000Z",
                     *             "metadata": {
                     *               "note": "Synthetic review example"
                     *             }
                     *           }
                     *         ]
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["rejectResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED | FORBIDDEN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ORDER_NOT_FOUND */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "ORDER_NOT_FOUND",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description ORDER_INVALID_TRANSITION */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "ORDER_INVALID_TRANSITION",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    adminOrders: {
        parameters: {
            query?: {
                /** @description Plain positive decimal integer, maximum 100, default 20. No repeated values. */
                pageSize?: string;
                sort?: "newest" | "oldest";
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": [],
                     *       "meta": {
                     *         "pageSize": 20,
                     *         "sort": "newest",
                     *         "hasMore": false,
                     *         "nextCursor": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["adminOrdersResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNAUTHORIZED */
            401: {
                headers: {
                    "WWW-Authenticate"?: "Bearer";
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNAUTHORIZED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED | FORBIDDEN */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    health: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "status": "ok"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["healthResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    ready: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": true,
                     *       "data": {
                     *         "status": "ready",
                     *         "database": "up"
                     *       },
                     *       "meta": null
                     *     }
                     */
                    "application/json": components["schemas"]["readyResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description SERVICE_NOT_READY */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "SERVICE_NOT_READY",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    docs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": components["schemas"]["docsResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    spec: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "openapi": "3.1.0"
                     *     }
                     */
                    "application/json": components["schemas"]["specResponse200"];
                };
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    media: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/svg+xml": components["schemas"]["mediaResponse200"];
                };
            };
            /** @description Not modified; no body */
            304: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_ERROR | MALFORMED_JSON */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "VALIDATION_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description CORS_ORIGIN_DENIED */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "CORS_ORIGIN_DENIED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description PAYLOAD_TOO_LARGE */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "PAYLOAD_TOO_LARGE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description UNSUPPORTED_MEDIA_TYPE */
            415: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "UNSUPPORTED_MEDIA_TYPE",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description RATE_LIMITED */
            429: {
                headers: {
                    /** @description Seconds until retry budget resets */
                    "Retry-After"?: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "RATE_LIMITED",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description INTERNAL_ERROR */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": {
                     *         "code": "INTERNAL_ERROR",
                     *         "message": "Illustrative error; see documented code",
                     *         "details": null
                     *       }
                     *     }
                     */
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
}
