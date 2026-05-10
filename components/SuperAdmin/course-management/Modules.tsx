"use client";
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import ModuleDetails from './ModuleDetails'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import AddModuleModal from './AddModuleModal'
import { parseCookies } from 'nookies'
import { AdminCourseManagementService } from '@/service/user/user.service'
import { showErrorToast, showSuccessToast } from '@/lib/hotToast'
import { TGetCourseModulesResponse } from '@/types/tutor.mycourse'

type ModulesProps = {
    courseId?: string
}

export default function Modules({ courseId }: ModulesProps) {
    const [openItem, setOpenItem] = useState<string>('')
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
    const [moduleData, setModuleData] = useState({
        moduleTitle: '',
        moduleName: '',
        moduleOverview: '',
    })
    const [modules, setModules] = useState<TGetCourseModulesResponse | null>(null)
    const [loading, setLoading] = useState(true)

    const loadModules = async () => {
        if (!courseId) return

        setLoading(true)
        try {
            const cookies = parseCookies()
            const token = cookies.token || cookies.accessToken || ''
            const response = await AdminCourseManagementService.getAllCourseModules({
                courseId,
                token,
            })
            setModules(response?.data || null)
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || error?.message || 'Failed to load modules')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadModules()
    }, [courseId])

    const handleAddModule = async () => {
        if (!courseId) return

        try {
            const cookies = parseCookies()
            const token = cookies.token || cookies.accessToken || ''
            const response = await AdminCourseManagementService.createCourseModule({
                courseId,
                token,
                payload: {
                    module_title: moduleData.moduleTitle,
                    module_name: moduleData.moduleName,
                    module_overview: moduleData.moduleOverview,
                },
            })

            showSuccessToast(response?.data?.message || 'Module added successfully')
            setModuleData({ moduleTitle: '', moduleName: '', moduleOverview: '' })
            setIsAddModuleOpen(false)
            await loadModules()
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || 'Failed to add module')
        }
    }

    if (loading) {
        return <div className='text-[#A5A5AB]'>Loading modules...</div>
    }

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
                {modules?.data?.map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="border border-[#3D4566] rounded-2xl [&_[data-slot=accordion-trigger]>svg]:hidden">
                        <AccordionTrigger className="flex items-center justify-between text-left text-white hover:no-underline cursor-pointer px-4 data-[state=open]:bg-[#262b40] rounded-t-2xl rounded-b-none">
                            <div className="flex flex-col gap-1">
                                <p className='text-sm text-[#8D9CDC]'>{module.module_title}</p>
                                <h3 className='text-base text-white font-medium'>{module.module_name}</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-[#A5A5AB] px-4">
                            <ModuleDetails module={module} onClassAdded={loadModules} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
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
            onAddModule={handleAddModule}
           />
        </div>
    )
}
