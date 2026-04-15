import { useState, useRef, useEffect } from 'react'
import { DEPARTMENTS, STORAGE_KEYS } from '../constants'
import { PrimaryButton } from './ui'

export default function OpportunityForm({ value, onChange, onSubmit, submitLabel, loading }) {
  const today = new Date().toISOString().split('T')[0]

  const [showDeptPanel, setShowDeptPanel] = useState(false)
  const deptRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setShowDeptPanel(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [showYearPanel, setShowYearPanel] = useState(false)
  const yearRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setShowYearPanel(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setField = (field, fieldValue) => {
    const next = { ...value, [field]: fieldValue }
    onChange(next)
    if (field === 'departments') {
      const lastDept = fieldValue.length === 1 ? fieldValue[0] : fieldValue.slice(-1)[0] || ''
      if (lastDept && lastDept !== 'Broadcast to All') {
        localStorage.setItem(STORAGE_KEYS.lastDepartment, lastDept)
      }
    } else if (field === 'department') {
      if (fieldValue !== 'Broadcast to All') {
        localStorage.setItem(STORAGE_KEYS.lastDepartment, fieldValue)
      }
    }
  }

  return (
    <div className="glass-panel p-6 shadow-lg shadow-slate-300/20 rounded-2xl bg-gray-50/50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Opportunity Details</h3>
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">Faculty Form</span>
      </div>
      <div className="grid gap-6">
        <div>
          <label className="label-modern text-sm font-semibold text-slate-700">Announcement Heading</label>
          <input
            className="input-modern w-full"
            value={value.announcementHeading}
            onChange={(e) => setField('announcementHeading', e.target.value)}
            placeholder="SDE Internship Drive - 2026"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-modern text-sm font-semibold text-slate-700">Opportunity Type</label>
            <select className="input-modern w-full" value={value.type} onChange={(e) => setField('type', e.target.value)}>
              <option>Internship</option>
              <option>Placement</option>
            </select>
          </div>
          <div>
            <label className="label-modern text-sm font-semibold text-slate-700">Department</label>
            <div className="relative" ref={deptRef}>
              <button
                type="button"
                className="input-modern w-full flex items-center justify-between"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeptPanel(!showDeptPanel)
                }}
              >
                <span>
                  {value.departments && value.departments.length === DEPARTMENTS.length ? 'Broadcast to All' :
                   value.departments ? `${value.departments.length} Department${value.departments.length !== 1 ? 's' : ''}` : 'Select Departments'}
                </span>
              <svg className={`h-4 w-4 transition-transform ${showDeptPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
{showDeptPanel && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto p-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-slate-50 w-full mb-2 block">
                    <input
                      type="checkbox"
                      checked={(value.departments || []).length === DEPARTMENTS.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setField('departments', DEPARTMENTS)
                        } else {
                          setField('departments', [])
                        }
                      }}
                      className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Select All Departments (Broadcast)</span>
                  </label>
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    {DEPARTMENTS.map((dept) => (
                      <label key={dept} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={(value.departments || []).includes(dept)}
                          onChange={(e) => {
                            const current = value.departments || []
                            if (e.target.checked) {
                              setField('departments', [...current.filter(d => d !== 'Broadcast to All'), dept])
                            } else {
                              setField('departments', current.filter(d => d !== dept))
                            }
                          }}
                          className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700 truncate">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="label-modern text-sm font-semibold text-slate-700">Description</label>
          <textarea
            rows={6}
            maxLength={10000}
            className="input-modern w-full"
            value={value.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Write detailed opportunity details, responsibilities, requirements, stipend info, venue, important notes, etc."
            title="Max 10000 characters - suitable for long job descriptions"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-modern text-sm font-semibold text-slate-700">Last Date</label>
            <input type="date" min={today} className="input-modern w-full" value={value.lastDate} onChange={(e) => setField('lastDate', e.target.value)} />
          </div>
          <div>
            <label className="label-modern text-sm font-semibold text-slate-700">Eligibility Criteria</label>
            <div className="relative" ref={yearRef}>
              <button
                type="button"
                className="input-modern w-full flex items-center justify-between"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowYearPanel(!showYearPanel)
                }}
              >
                <span>
                  {value.yearEligibility && value.yearEligibility.length > 0
                    ? `${value.yearEligibility.length} Year${value.yearEligibility.length !== 1 ? 's' : ''}`
                    : 'Select Years'}
                </span>
                <svg className={`h-4 w-4 transition-transform ${showYearPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showYearPanel && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-auto p-3">
                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                    {['First Year', 'Second Year', 'Third Year', 'Masters'].map((year) => (
                      <label key={year} className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 w-full">
                        <input
                          type="checkbox"
                          checked={value.yearEligibility?.includes(year) || false}
                          onChange={(e) => {
                            const current = value.yearEligibility || []
                            if (e.target.checked) {
                              setField('yearEligibility', [...current, year])
                            } else {
                              setField('yearEligibility', current.filter((y) => y !== year))
                            }
                          }}
                          className="rounded w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{year}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="label-modern text-sm font-semibold text-slate-700">Application Link</label>
          <input
            className="input-modern w-full"
            type="url"
            value={value.applicationLink}
            onChange={(e) => setField('applicationLink', e.target.value)}
            placeholder="https://forms.gle/..."
          />
        </div>
        <PrimaryButton loading={loading} disabled={loading} onClick={onSubmit} className="w-full md:w-auto mt-2">
          {submitLabel}
        </PrimaryButton>
      </div>
    </div>
  )
}
