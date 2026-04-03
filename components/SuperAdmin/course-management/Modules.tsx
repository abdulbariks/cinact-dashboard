'use client'
import React, { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import ModuleDetails from './ModuleDetails'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import AddModuleModal from './AddModuleModal'

export default function Modules() {
    const [openItem, setOpenItem] = useState<string>('')
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
    const [moduleData, setModuleData] = useState({
        moduleTitle: '',
        moduleName: '',
        moduleOverview: '',
    })

    return (
        <div  >
            <h2 className=' text-xl text-white font-medium mb-4'>All Module</h2>
            <Accordion
                type="single"
                collapsible
                value={openItem}
                onValueChange={(v) => setOpenItem(v)}
                className="w-full flex flex-col gap-3"
            >
                <AccordionItem value="module-1" className="border border-[#3D4566] rounded-2xl [&_[data-slot=accordion-trigger]>svg]:hidden">
                    <AccordionTrigger className="flex items-center justify-between text-left text-white hover:no-underline cursor-pointer    px-4 data-[state=open]:bg-[#262b40] rounded-t-2xl rounded-b-none  ">
                        <div className="flex flex-col gap-1">
                            <p className='text-sm text-[#8D9CDC]'>Module-1</p>
                            <h3 className='text-base text-white font-medium'>Personal Development</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-[#A5A5AB] px-4">
                       <ModuleDetails/>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="module-2" className="border border-[#3D4566] rounded-2xl [&_[data-slot=accordion-trigger]>svg]:hidden">
                    <AccordionTrigger className="flex items-center justify-between text-left text-white hover:no-underline cursor-pointer px-4 data-[state=open]:bg-[#262b40] rounded-t-2xl rounded-b-none">
                        <div className="flex flex-col gap-1">
                            <p className='text-sm text-[#8D9CDC]'>Module-2</p>
                            <h3 className='text-base text-white font-medium'>Script Analysis</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-[#A5A5AB] px-4">
                      <ModuleDetails/>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="module-3" className="border border-[#3D4566] rounded-2xl [&_[data-slot=accordion-trigger]>svg]:hidden">
                    <AccordionTrigger className="flex items-center justify-between text-left text-white hover:no-underline cursor-pointer px-4 data-[state=open]:bg-[#262b40] rounded-t-2xl rounded-b-none">
                        <div className="flex flex-col gap-1">
                            <p className='text-sm text-[#8D9CDC]'>Module-3</p>
                            <h3 className='text-base text-white font-medium'>Meisner</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-[#A5A5AB] px-4">
                       <ModuleDetails/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
           
           <button
            onClick={() => setIsAddModuleOpen(true)}
            className=' mt-4 bg-[#07121d] border border-[#3D4566] border-dashed rounded-[10px] py-6 flex items-center justify-center gap-2 cursor-pointer w-full'
           >
            <PlusIcon/>
            <p className=' text-base  text-white font-medium'>Add Module</p>
           </button>

           <AddModuleModal
            open={isAddModuleOpen}
            onOpenChange={setIsAddModuleOpen}
            moduleData={moduleData}
            setModuleData={setModuleData}
           />
        </div>
    )
}
