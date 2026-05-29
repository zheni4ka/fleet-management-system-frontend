"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Auto } from "@/lib/types"
import EditAutoModal from '../edit/edit-auto-modal';

const inter = Inter({ subsets: ['latin'] })

interface AutosTableProps {
    data: Auto[]
}


export const AutosTable: React.FC<AutosTableProps> = ({ data }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);


  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Ви впевнені, що хочете видалити автомобіль?');
    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    try {
      const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = base ? `${base}/api/Auto/${id}` : `/api/Auto/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Помилка сервера: ${response.status}`);
      }

      router.refresh();
    } catch (error) {
      console.error('Не вдалося видалити автомобіль:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!data || data.length === 0) {
        return <p className="text-muted-foreground">Автомобілів не знайдено.</p>
    }

        return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="">
          <TableRow>
            <TableHead className={`w-1/6 ${inter.className}`}>ID</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Марка</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Модель</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Колір</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Номер</TableHead>
            <TableHead className={`w-1/6 ${inter.className} text-center`}>Операції</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((auto) => (
            <TableRow key={auto.id} className="hover:bg-slate-50/50">
              <TableCell className={`font-mono text-xs ${inter.className}`}>{auto.id}</TableCell>
              <TableCell className={`font-medium ${inter.className}`}>{auto.mark}</TableCell>
              <TableCell className={` ${inter.className}`}>{auto.model}</TableCell>
              <TableCell className={` ${inter.className}`}>{auto.color}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {auto.number}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <EditAutoModal auto={auto}/>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(auto.id)}
                    disabled={deletingId === auto.id}
                  >
                    Видалити
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
        );
}

export default AutosTable;