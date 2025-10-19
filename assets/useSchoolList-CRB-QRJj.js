import{u as r}from"./vendor-tanstack-Cjudyj3h.js";const s="https://catalogue.data.govt.nz/api/3/action/datastore_search_sql",o="4b292323-9fcc-41f8-814b-3c7b19cf14b3",i=async()=>{const a=new URL(s),t=`
    SELECT
      "School_Id" as "schoolId",
      "Org_Name" as "name",
      "Add1_City" as "city",
      "URL" as "url",
      "Latitude"::double precision as "lat",
      "Longitude"::double precision as "lng",
      CASE WHEN "Māori" IS NULL THEN 0 ELSE "Māori"::int END as "maori",
      CASE WHEN "Pacific" IS NULL THEN 0 ELSE "Pacific"::int END as "pacific",
      CASE WHEN "European" IS NULL THEN 0 ELSE "European"::int END as "european",
      CASE WHEN "Asian" IS NULL THEN 0 ELSE "Asian"::int END as "asian",
      CASE WHEN "MELAA" IS NULL THEN 0 ELSE "MELAA"::int END as "melaa",
      CASE WHEN "International" IS NULL THEN 0 ELSE "International"::int END as "international",
      CASE WHEN "Other" IS NULL THEN 0 ELSE "Other"::int END as "other",
      CASE WHEN "Total" IS NULL THEN 0 ELSE "Total"::int END as "total",
      1 as "count"
    FROM
      "${o}"
    `.trim().replace(/\s\s+/g," ");a.search=new URLSearchParams({sql:t}).toString();const e=await fetch(a.toString()).then(n=>n.json()).catch(()=>{throw new Error("Unable to connect to the schools database. Please check your internet connection and try again.")});if(!e.success)throw new Error("The schools database is currently unavailable. Please try again later.");return e.result.records},c=()=>{const{data:a,error:t,isPending:e}=r({queryKey:["schools"],queryFn:i});return e?{isPending:!0,data:void 0,error:null}:t?{isPending:!1,data:void 0,error:t}:{isPending:!1,data:a,error:null}};export{c as u};
