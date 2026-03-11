/**
 * ============================================================================
 * 📦 COMPONENTE: Solicitantes
 * 💻 PROJETO: SupportBox
 * 👨‍💻 DESENVOLVEDOR: Gabriel
 * ============================================================================
 * 📝 DESCRIÇÃO:
 * Diretório de utilizadores que abriram chamados. Esta página agrupa os
 * tickets por solicitante para criar perfis dinâmicos com estatísticas
 * como total de chamados e a data da última interação.
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";
import { db, Ticket } from "@/lib/db";
import { Users, Mail, Phone, Building, MoreVertical } from "lucide-react";

// Tipagem temporária para agrupar os utilizadores
type RequesterStats = {
  name: string;
  totalTickets: number;
  lastTicketDate: string;
};

export default function SolicitantesPage() {
  const [requesters, setRequesters] = useState<RequesterStats[]>([]);

  useEffect(() => {
    const processRequesters = async () => {
      const tickets = await db.getTickets();

      // Agrupa os tickets por solicitante para contar quantos cada um tem
      const statsMap = tickets.reduce(
        (acc, ticket) => {
          if (!acc[ticket.requester]) {
            acc[ticket.requester] = {
              name: ticket.requester,
              totalTickets: 0,
              lastTicketDate: "",
            };
          }
          acc[ticket.requester].totalTickets += 1;
          // Pega a data mais recente
          const tDate =
            ticket.date ||
            new Date(ticket.created_at!).toLocaleDateString("pt-BR");
          acc[ticket.requester].lastTicketDate = tDate;
          return acc;
        },
        {} as Record<string, RequesterStats>,
      );

      setRequesters(Object.values(statsMap));
    };

    processRequesters();
  }, []);

  return (
    <main className="p-6 md:p-10 animate-in fade-in duration-500">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Diretório de Solicitantes
          </h1>
        </div>
        <p className="text-slate-500">
          Visualize os colaboradores que interagem com o setor de TI.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {requesters.map((req, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <MoreVertical size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-slate-600">
                {req.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {req.name}
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1 inline-block">
                  Colaborador
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span>
                  {req.name.toLowerCase().replace(" ", ".")}@empresa.com
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Building size={16} className="text-slate-400" />
                <span>Departamento Geral</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-center flex-1 border-r border-slate-200">
                <p className="text-xs text-slate-500 font-medium">Chamados</p>
                <p className="text-lg font-bold text-slate-800">
                  {req.totalTickets}
                </p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-slate-500 font-medium">
                  Último Ticket
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {req.lastTicketDate}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Card Placeholder para simular uma base maior */}
        {requesters.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-400">
            Nenhum solicitante registado ainda.
          </div>
        )}
      </div>
    </main>
  );
}
