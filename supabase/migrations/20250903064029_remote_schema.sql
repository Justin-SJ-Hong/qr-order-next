

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."OptionGroupType" AS ENUM (
    'SINGLE',
    'MULTI'
);


ALTER TYPE "public"."OptionGroupType" OWNER TO "postgres";


CREATE TYPE "public"."OrderChannel" AS ENUM (
    'APP',
    'POS'
);


ALTER TYPE "public"."OrderChannel" OWNER TO "postgres";


CREATE TYPE "public"."OrderStatus" AS ENUM (
    'PLACED',
    'PAID',
    'PREPARING',
    'DONE',
    'CANCELLED'
);


ALTER TYPE "public"."OrderStatus" OWNER TO "postgres";


CREATE TYPE "public"."PaymentMethod" AS ENUM (
    'MOCK',
    'CARD',
    'TOSSPAY',
    'KAKAOPAY',
    'NPAY',
    'TRANSFER'
);


ALTER TYPE "public"."PaymentMethod" OWNER TO "postgres";


CREATE TYPE "public"."PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCEEDED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE "public"."PaymentStatus" OWNER TO "postgres";


CREATE TYPE "public"."RecommendationKind" AS ENUM (
    'UPSELL',
    'DOWNSELL'
);


ALTER TYPE "public"."RecommendationKind" OWNER TO "postgres";


CREATE TYPE "public"."RecommendationStep" AS ENUM (
    'MENU_DETAIL',
    'CART',
    'CHECKOUT'
);


ALTER TYPE "public"."RecommendationStep" OWNER TO "postgres";


CREATE TYPE "public"."StoreStatus" AS ENUM (
    'OPEN',
    'CLOSED'
);


ALTER TYPE "public"."StoreStatus" OWNER TO "postgres";


CREATE TYPE "public"."UserRole" AS ENUM (
    'CUSTOMER',
    'OWNER'
);


ALTER TYPE "public"."UserRole" OWNER TO "postgres";


CREATE TYPE "public"."UserStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED'
);


ALTER TYPE "public"."UserStatus" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "text" NOT NULL,
    "storeId" "text" NOT NULL,
    "name" "text" NOT NULL,
    "sort" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."menu_recommendations" (
    "id" "text" NOT NULL,
    "storeId" "text" NOT NULL,
    "sourceMenuId" "text" NOT NULL,
    "targetMenuId" "text" NOT NULL,
    "kind" "public"."RecommendationKind" NOT NULL,
    "atStep" "public"."RecommendationStep" NOT NULL,
    "priority" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "startAt" timestamp(3) without time zone,
    "endAt" timestamp(3) without time zone,
    "condition" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."menu_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."menus" (
    "id" "text" NOT NULL,
    "storeId" "text" NOT NULL,
    "categoryId" "text" NOT NULL,
    "name" "text" NOT NULL,
    "desc" "text",
    "price" integer NOT NULL,
    "imageUrl" "text",
    "isActive" boolean DEFAULT true NOT NULL,
    "sort" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."menus" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."option_choices" (
    "id" "text" NOT NULL,
    "groupId" "text" NOT NULL,
    "name" "text" NOT NULL,
    "priceDelta" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sort" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."option_choices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."option_groups" (
    "id" "text" NOT NULL,
    "menuId" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."OptionGroupType" NOT NULL,
    "min" integer NOT NULL,
    "max" integer NOT NULL,
    "sort" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."option_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_item_options" (
    "id" "text" NOT NULL,
    "orderItemId" "text" NOT NULL,
    "groupName" "text" NOT NULL,
    "choiceName" "text" NOT NULL,
    "priceDelta" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."order_item_options" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "text" NOT NULL,
    "orderId" "text" NOT NULL,
    "menuId" "text" NOT NULL,
    "nameSnap" "text" NOT NULL,
    "qty" integer NOT NULL,
    "unitPrice" integer NOT NULL,
    "lineTotal" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "text" NOT NULL,
    "orderNo" "text" NOT NULL,
    "userId" "text",
    "storeId" "text" NOT NULL,
    "channel" "public"."OrderChannel" NOT NULL,
    "status" "public"."OrderStatus" DEFAULT 'PLACED'::"public"."OrderStatus" NOT NULL,
    "subtotal" integer NOT NULL,
    "discount" integer NOT NULL,
    "total" integer NOT NULL,
    "orderedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "text" NOT NULL,
    "orderId" "text" NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "status" "public"."PaymentStatus" DEFAULT 'PENDING'::"public"."PaymentStatus" NOT NULL,
    "amount" integer NOT NULL,
    "currency" "text" DEFAULT 'KRW'::"text" NOT NULL,
    "txId" "text",
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stores" (
    "id" "text" NOT NULL,
    "ownerId" "text" NOT NULL,
    "name" "text" NOT NULL,
    "phone" "text",
    "address" "text",
    "status" "public"."StoreStatus" DEFAULT 'OPEN'::"public"."StoreStatus" NOT NULL,
    "settings" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."stores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "role" "public"."UserRole" DEFAULT 'CUSTOMER'::"public"."UserRole" NOT NULL,
    "status" "public"."UserStatus" DEFAULT 'ACTIVE'::"public"."UserStatus" NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."menu_recommendations"
    ADD CONSTRAINT "menu_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."option_choices"
    ADD CONSTRAINT "option_choices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."option_groups"
    ADD CONSTRAINT "option_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_item_options"
    ADD CONSTRAINT "order_item_options_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "menus_isActive_idx" ON "public"."menus" USING "btree" ("isActive");



CREATE INDEX "menus_sort_idx" ON "public"."menus" USING "btree" ("sort");



CREATE INDEX "menus_storeId_idx" ON "public"."menus" USING "btree" ("storeId");



CREATE UNIQUE INDEX "orders_orderNo_key" ON "public"."orders" USING "btree" ("orderNo");



CREATE UNIQUE INDEX "users_email_key" ON "public"."users" USING "btree" ("email");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menu_recommendations"
    ADD CONSTRAINT "menu_recommendations_sourceMenuId_fkey" FOREIGN KEY ("sourceMenuId") REFERENCES "public"."menus"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menu_recommendations"
    ADD CONSTRAINT "menu_recommendations_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menu_recommendations"
    ADD CONSTRAINT "menu_recommendations_targetMenuId_fkey" FOREIGN KEY ("targetMenuId") REFERENCES "public"."menus"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."option_choices"
    ADD CONSTRAINT "option_choices_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."option_groups"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."option_groups"
    ADD CONSTRAINT "option_groups_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_item_options"
    ADD CONSTRAINT "order_item_options_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."order_items"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."menu_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."menu_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."menu_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."menus" TO "anon";
GRANT ALL ON TABLE "public"."menus" TO "authenticated";
GRANT ALL ON TABLE "public"."menus" TO "service_role";



GRANT ALL ON TABLE "public"."option_choices" TO "anon";
GRANT ALL ON TABLE "public"."option_choices" TO "authenticated";
GRANT ALL ON TABLE "public"."option_choices" TO "service_role";



GRANT ALL ON TABLE "public"."option_groups" TO "anon";
GRANT ALL ON TABLE "public"."option_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."option_groups" TO "service_role";



GRANT ALL ON TABLE "public"."order_item_options" TO "anon";
GRANT ALL ON TABLE "public"."order_item_options" TO "authenticated";
GRANT ALL ON TABLE "public"."order_item_options" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."stores" TO "anon";
GRANT ALL ON TABLE "public"."stores" TO "authenticated";
GRANT ALL ON TABLE "public"."stores" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
