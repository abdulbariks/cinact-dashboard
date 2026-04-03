
import React from 'react'
import PlusIcon from '@/components/icons/SuperAdmindashboard/PlusIcon'
import RightArrowModuleIcon from '@/components/icons/course-management/RightArrowModuleIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const classes=[
  {
    id:'2200',
    classNo:'1',
    className:'Voice & Breath Control',
    status:'complete'
  },
  {
    id:'2201',
    classNo:'2',
    className:'Physical Awareness',
    status:'complete'
  },
  {
    id:'2202',
    classNo:'3',
    className:'Breathing Techniques',
    status:'complete'
  },
  {
    id:'2203',
    classNo:'4',
    className:'Posture and Presence',
    status:'complete'
  },
  {
    id:'2204',
    classNo:'5',
    className:'Vocal Projection',
    status:'complete'
  },
  {
    id:'2205',
    classNo:'6',
    className:'Articulation Practice',
    status:'complete'
  },
  {
    id:'2206',
    classNo:'7',
    className:'Movement Flow',
    status:'next class'
  },
  {
    id:'2207',
    classNo:'8',
    className:'Listening Skills',
    status:null
  },
  {
    id:'2208',
    classNo:'9',
    className:'Partner Work',
    status:null
  },
  {
    id:'2209',
    classNo:'10',
    className:'Emotional Recall',
    status:null
  },
  {
    id:'2210',
    classNo:'11',
    className:'Scene Objectives',
    status:null
  },
  {
    id:'2211',
    classNo:'12',
    className:'Improvisation Basics',
    status:null
  },
  {
    id:'2212',
    classNo:'13',
    className:'Character Exploration',
    status:null
  },
  {
    id:'2213',
    classNo:'14',
    className:'Performance Review',
    status:null
  }
]

export default function ModuleDetails() {

const path =usePathname();
const courseId = path.split('/')[4]; // Extract courseId from the URL

  return (
    <div className='  mt-3'>
        <div className=' px-4 pt-4 pb-8 border  border-[#3D4566] rounded-[12px] bg-[#07121d]'>
            <h3 className=' text-base text-white font-medium '>Module Overview</h3>
            <p className=' text-sm text-[#D2D2D5] my-2.5'>This module develops the actor’s self-awareness, confidence, and creativity as a foundation for authentic performance.</p>
            <h3 className=' text-sm text-white   mt-4'>Key Learning Outcomes</h3>
            <ul className=' mt-2.5'>
              <li className=' text-sm text-[#D2D2D5] '> <span className=' text-[#E9201D]'>⊹</span>  Gain self-awareness and confidence</li>
              <li className=' text-sm text-[#D2D2D5] '> <span className=' text-[#E9201D]'>⊹</span> Boost creativity and focus</li>
              <li className=' text-sm text-[#D2D2D5] '> <span className=' text-[#E9201D]'>⊹</span>   Improve communication skills</li>
               
            </ul>
        </div>

        <div>
          <h3 className=' text-base text-white font-medium my-3'>All classes</h3>
          <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {classes.map((cls) => (
              <Link
                href={`/dashboard/course-management/course-details/${courseId}/${cls.id}`}
                key={cls.id}
                className={`p-4 border-l-2 rounded-[12px] flex items-center justify-between ${
                  cls.status === 'next class'
                    ? 'bg-[#12283d] border-[#F9C80E]'
                    : 'bg-[#0a1d2e] border-[#0a1d2e] '
                }`}
              >
                <div>
                <div className=' flex items-center gap-2'>
                 <h3 className=' text-sm text-[#8D9CDC] '>Class-{cls.classNo}</h3>
                 {
                  cls.status && (
                    <p
                      className={`text-xs font-medium py-1 px-2 rounded-full inline-block ${
                        cls.status === 'next class'
                          ? 'text-[#030C15] bg-[#8D9CDC] '
                          : 'text-[#18CC3F] bg-[#2a3d2e]'
                      }`}
                    >
                      {cls.status}
                    </p>
                  )
                 }

                </div>
                <h2 className=' text-base text-white font-medium mt-1'>{cls.className}</h2>
                </div>
                 <div>
                
                   <RightArrowModuleIcon/>
                </div>

              </Link>
            ))}

            <button
              type='button'
              className='py-6 px-4 border border-dashed border-[#5F6CA0] rounded-[12px] flex items-center justify-center gap-2 text-[#8D9CDC] font-medium hover:text-white hover:border-[#8D9CDC] transition-colors cursor-pointer'
            >
              <PlusIcon />
              Add Class
            </button>
        
          </div>
        </div>
    </div>
  )
}
