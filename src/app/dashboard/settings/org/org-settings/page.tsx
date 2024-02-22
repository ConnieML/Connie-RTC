"use client";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function OrganizationSettings() {
 const [organizationName, setOrganizationName] = useState("");
 const [logo, setLogo] = useState<string | null>(null);
 const [logoFile, setLogoFile] = useState<File | null>(null);


 const handleOrganizationNameChange = (
   event: React.ChangeEvent<HTMLInputElement>,
 ) => {
   setOrganizationName(event.target.value);
 };


 const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   if (event.target.files && event.target.files.length > 0) {
     const file = event.target.files[0];
     const fileUrl = URL.createObjectURL(file);
     setLogo(fileUrl); // Update logo URL for preview
     setLogoFile(file); // Update selected file
   } else {
     setLogo(null); // Reset logo URL if no file is selected
     setLogoFile(null); // Reset selected file
   }
 };


 const handleUpdateOrganizationName = () => {
   console.log("Organization Name updated to:", organizationName);
 };


 const handleUploadLogo = () => {
   console.log("Logo uploaded:", logo);
 };


 return (
   <div className="p-8">
     <h1 className="text-3xl font-bold mb-4">Organization Settings</h1>
     <p className="mb-3 text-[#64748B]">
       Manage your organization settings here.
     </p>
     <hr className="border-t border-gray-200 mb-6" />


     <div className="mb-8">
       <label
         className="block text-lg font-semibold mb-2"
         htmlFor="organization-name"
       >
         Organization Name
       </label>
       <div className="flex items-center space-x-2">
         <Input
           type="text"
           id="organization-name"
           placeholder="American Society on Aging"
           value={organizationName}
           onChange={handleOrganizationNameChange}
           className="text-base w-96 mr-2 border border-gray-200 placeholder-gray-200"
         />
         <Button
           onClick={handleUpdateOrganizationName}
           className="bg-[#FF9500] hover:bg-[#e08500]"
         >
           Update
         </Button>
       </div>
       <p className="text-sm text-[#64748B] mt-2">
         This will be displayed on sign-in and in app-wide top navigation.
       </p>
     </div>


     <div className="mb-8">
       <label className="block text-lg font-semibold mb-2">
         Organization Logo
       </label>
       <p className="mb-6 text-sm text-[#64748B]">
         This will be displayed on sign-in and in app-wide top navigation.
       </p>
       <div className="flex items-start space-x-4">
         {logo ? (
           <img
             src={logo}
             alt="Organization Logo"
             className="h-20 w-20 object-cover"
           />
         ) : (
           <div className="h-20 w-20 bg-[#0FBED8]"></div>
         )}
         <div>
           <input
             type="file"
             id="logo-upload"
             onChange={handleLogoChange}
             className="hidden"
           />
           <label htmlFor="logo-upload" className="cursor-pointer">
             <Button asChild className="bg-[#FF9500] hover:bg-[#e08500]">
               <span className="flex items-center">
                 <FiUpload className="mr-2" />
                 Upload Logo
               </span>
             </Button>
           </label>
         </div>
       </div>
     </div>
     {/* CRM Configuration Section */}
     <div className="mb-8">
       <h2 className="text-lg font-semibold mt-14 mb-3">CRM Configuration</h2>
       <p className="mb-6 text-sm text-[#000000]">
         Connie uses Airtable as a data source for your CBO's client contact
         data.
       </p>
       {/* You can add an input or a custom component for CRM configuration */}
       <p className="mb-4 font-semibold">No table currently selected.</p>
       {/* Placeholder button for CRM configuration */}
       <Button className="bg-[#FF9500] hover:bg-[#e08500]">Configure</Button>
     </div>
   </div>
 );
}
