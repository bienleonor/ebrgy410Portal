import React from 'react'
import { Axios } from 'axios'

const DocumentRequestingForm = () => {
  return (
    <div>
        <div class="w-full max-w-xs form-container p-6">
            <h1 class="text-2xl font-normal border-b border-black pb-1 w-fit mb-4 select-none form-title">
            CERTIFICATE
            </h1>
            <form class="space-y-3 text-black text-lg">
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">TYPE: </label>
                <select class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none">
                <option value="" disabled selected>Select type</option>
                <option value="Certificate of Clearance">Certificate of Clearance</option>
                <option value="Certificate of Indigency">Certificate of Indigency</option>
                <option value="Business Certification (Permit)">Business Certification (Permit)</option>
                <option value="First time job seeker certiifcate">First time job seeker certiifcate</option>
                <option value="Working Permit">Working Permit</option>
                </select>
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">FNAME: </label>
                <input type="text" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">LNAME: </label>
                <input type="text" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">SNAME: </label>
                <input type="text" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">SEX/GENDER:</label>
                <select class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none">
                <option value="" disabled selected>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select>
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">CONTACT: </label>
                <input type="tel" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="e.g., 123-456-7890" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">DATE BIRTH: </label>
                <input type="date" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">AGE :</label>
                <input type="number" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">ADDRESS :</label>
                <input type="text" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">PURPOSE :</label>
                <select class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none">
                <option value="" disabled selected>Select purpose</option>
                <option value="Burial">Burial</option>
                <option value="personal">Financial</option>
                <option value="Medical">Medical</option>
                <option value="Financial/Medical">Financial/Medical</option>
                <option value="Others (Please specify)">Others (Please specify)</option>
                </select>
            </div>
            <div class="flex items-center space-x-2">
                <input type="checkbox" id="other" class="w-4 h-4 border-black" />
                <label for="other" class="font-normal select-none">other</label>
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">SPECIFY :</label>
                <input type="text" class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none" placeholder="" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-normal select-none">STATUS :</label>
                <select class="input-border w-36 h-6 bg-transparent text-black text-lg font-normal focus:outline-none">
                <option value="" disabled selected>Select status</option>
                <option value="active">Single</option>
                <option value="inactive">Married</option>
                <option value="widowed">Widowed</option>
                <option value="Devorced">Devorced</option>
                </select>
            </div>
            <div class="flex justify-center">
                <button type="submit" class="mt-4 submit-button py-2 px-4 rounded">Submit</button>
            </div>
            </form>
        </div>
  </div>
  )
}

export default DocumentRequestingForm