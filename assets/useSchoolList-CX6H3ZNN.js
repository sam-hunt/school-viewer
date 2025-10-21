import{u as n}from"./vendor-tanstack-DTWbCzqv.js";const s="https://catalogue.data.govt.nz/api/3/action/datastore_search_sql",o="4b292323-9fcc-41f8-814b-3c7b19cf14b3",i="Unable to connect to the schools database. Please check your internet connection and try again.",E="The schools database is currently unavailable. Please try again later.",c=async()=>{const a=new URL(s),e=`
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
    `.trim().replace(/\s\s+/g," ");a.search=new URLSearchParams({sql:e}).toString();const t=await fetch(a.toString()).then(r=>r.json()).catch(()=>Promise.reject(new Error(i)));if(!t.success)throw new Error(E);return t.result.records},L=()=>{const{data:a,error:e,isPending:t}=n({queryKey:["schools"],queryFn:c});return t?{isPending:!0,data:void 0,error:null}:e?{isPending:!1,data:void 0,error:e}:{isPending:!1,data:a,error:null}};export{L as u};
