 
import React from 'react'
import RightArrowModuleIcon from '@/components/icons/course-management/RightArrowModuleIcon';
import Link from 'next/link';


const classes=[
  {
    id:'2200',
    classNo:'Class-1',
    className:'Voice & Breath Control',
    status:'complete'
  },
  {
    id:'2201',
    classNo:'Class-2',
    className:'Physical Awareness',
    status:'next class'
  },
  {
    id:'2202',
    classNo:'Class-3',
    className:'Breathing Techniques',
    status:null
  },
  {
    id:'2203',
    classNo:'Class-4',
    className:'Posture and Presence',
    status:null
  },
  {
    id:'2204',
    classNo:'Class-5',
    className:'Vocal Projection',
    status:null
  },
  {
    id:'2205',
    classNo:'Class-6',
    className:'Articulation Practice',
    status:null
  },
  {
    id:'2206',
    classNo:'Class-7',
    className:'Movement Flow',
    status:null
  },
  {
    id:'2207',
    classNo:'Class-8',
    className:'Listening Skills',
    status:null
  },
  {
    id:'2208',
    classNo:'Class-9',
    className:'Partner Work',
    status:null
  },
  {
    id:'2209',
    classNo:'Class-10',
    className:'Emotional Recall',
    status:null
  },
  {
    id:'2210',
    classNo:'Class-11',
    className:'Scene Objectives',
    status:null
  },
  {
    id:'2211',
    classNo:'Class-12',
    className:'Improvisation Basics',
    status:null
  },
  {
    id:'2212',
    classNo:'Class-13',
    className:'Character Exploration',
    status:null
  },
  {
    id:'2213',
    classNo:'Class-14',
    className:'Performance Review',
    status:null
  },
  {
    id:'2214',
    classNo:'Class-15',
    className:'Final Presentation',
    status:null
  }
]

export default function ModuleDetails() {
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
                href='#'
                key={cls.id}
                className={`p-4 border-l-2 rounded-[12px] flex items-center justify-between ${
                  cls.status === 'next class'
                    ? 'bg-[#12283d] border-[#F9C80E]'
                    : 'bg-[#0a1d2e] border-[#0a1d2e] '
                }`}
              >
                <div>
                <div className=' flex items-center gap-2'>
                 <h3 className=' text-sm text-[#8D9CDC] '>{cls.classNo}</h3>
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
        
          </div>
        </div>
    </div>
  )
}
