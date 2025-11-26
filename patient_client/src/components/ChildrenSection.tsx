'use client'
import React, { useState, useEffect } from "react"
import { useStore } from "@/store"
import { Plus, Trash2 } from "lucide-react"
import { Child } from "@/types/child"
import UserService from "@/services/user"

const ChildrenSection = () => {
    const store = useStore()
    const [children, setChildren] = useState<Child[]>([])

    const [child, setChild] = useState<Child>({
        patientId: store.user?.personId || 0,
        polis: null,
        lastName: "",
        firstName: "",
        patronymicName: "",
        snils: "",
        docSeries: "",
        docNumber: "",
        birthDate: "",
    })

    const handleChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setChild(prev => ({ ...prev, [name]: value }))
    }

    const handleAddChild = async () => {
        if (
            !child.lastName.trim() ||
            !child.firstName.trim() ||
            !child.snils?.trim()
        )
        return

        try {
            const response = await UserService.addChildren(child)
            
            setChildren(prev => [...prev, response.data])
            setChild({
                lastName: "",
                firstName: "",
                patientId: store.user?.personId || 0,
                polis: null,
                patronymicName: "",
                snils: "",
                docSeries: "",
                docNumber: "",
                birthDate: "",
            })
        } catch (error) {
            console.error("Ошибка при добавлении ребенка:", error)
        }
    }

    const handleRemoveChild = (index: number) => {
        try {
            UserService.removeChild(children[index].id || 0)
            setChildren(prev => prev.filter((_, i) => i !== index))
        }
        catch (error) {
            console.error("Ошибка при удалении ребенка:", error)
        }
    }

    const fetchChildren = async () => {
        try {
            const response = await UserService.getChildren(store.user?.personId)
            setChildren(response.data)
        } catch (error) {
            console.error("Ошибка при загрузке детей:", error)
        }
    }

    useEffect(() => {
        fetchChildren()
    }, [])


  return (
    <div className="space-y-8">
      {/* Список детей */}
      {children.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Ваши дети</h3>
          {children.map((c, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg border"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {c.lastName} {c.firstName} {c.patronymicName}
                </p>
                <p className="text-sm text-gray-600">
                  Дата рождения: {c.birthDate || "—"}<br />
                  СНИЛС: {c.snils} • Документ: {c.docSeries} {c.docNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveChild(i)}
                className="mt-2 sm:mt-0 flex items-center text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Форма добавления */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900">Фамилия</label>
          <input
            type="text"
            name="lastName"
            value={child.lastName}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Имя</label>
          <input
            type="text"
            name="firstName"
            value={child.firstName}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Отчество</label>
          <input
            type="text"
            name="patronymicName"
            value={child.patronymicName || ""}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Дата рождения</label>
          <input
            type="date"
            name="birthDate"
            value={child.birthDate}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">СНИЛС</label>
          <input
            type="text"
            name="snils"
            value={child.snils || ""}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Серия документа</label>
          <input
            type="text"
            name="docSeries"
            value={child.docSeries || ""}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Номер документа</label>
          <input
            type="text"
            name="docNumber"
            value={child.docNumber || ""}
            onChange={handleChildChange}
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddChild}
          className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" /> Добавить ребенка
        </button>
      </div>
    </div>
  )
}

export default ChildrenSection  