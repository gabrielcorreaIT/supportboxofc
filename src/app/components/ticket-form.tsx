"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Package, AlertTriangle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  type: z.enum(["request", "incident"]),
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  priority: z.string(),
  category: z.string(),
  impact: z.string().optional(),
  urgency: z.string().optional(),
})

export default function TicketForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "request",
      title: "",
      description: "",
      priority: "medium",
      category: "software",
    },
  })

  const watchType = form.watch("type")

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Em uma aplicação real, você enviaria para o backend aqui
    console.log(values)
    setIsSubmitted(true)

    // Resetar formulário após 3 segundos
    setTimeout(() => {
      setIsSubmitted(false)
      form.reset()
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-supportbox/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="bg-supportbox/20 p-3 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-supportbox" />
            </div>
            <h3 className="text-xl font-semibold">
              {watchType === "incident" ? "Incidente Reportado com Sucesso" : "Solicitação Enviada com Sucesso"}
            </h3>
            <p className="text-muted-foreground">
              {watchType === "incident"
                ? "Seu incidente foi reportado para a equipe de TI. Você receberá atualizações por e-mail."
                : "Sua solicitação foi enviada para a equipe de TI. Você receberá atualizações por e-mail."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-supportbox/20">
      <CardHeader className="border-b border-supportbox/10">
        <div className="flex items-center gap-2">
          {watchType === "incident" ? (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          ) : (
            <Package className="h-5 w-5 text-supportbox" />
          )}
          <CardTitle>
            {watchType === "incident" ? "Reportar um Incidente" : "Enviar uma Solicitação de Suporte"}
          </CardTitle>
        </div>
        <CardDescription>
          {watchType === "incident"
            ? "Reporte um problema ou falha que esteja afetando seu trabalho."
            : "Solicite um novo serviço, acesso ou informação da equipe de TI."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Chamado</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="request" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <Package className="h-4 w-4 mr-2 text-supportbox" />
                          Solicitação
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="incident" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          Incidente
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    {watchType === "incident"
                      ? "Selecione Incidente para reportar problemas ou falhas."
                      : "Selecione Solicitação para pedir novos serviços ou acessos."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do {watchType === "incident" ? "Incidente" : "Chamado"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        watchType === "incident" ? "Descreva brevemente o problema" : "Resumo breve da sua solicitação"
                      }
                      {...field}
                      className="border-supportbox/20 focus:ring-supportbox/30"
                    />
                  </FormControl>
                  <FormDescription>Mantenha curto e descritivo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-supportbox/20 focus:ring-supportbox/30">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="network">Rede</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="access">Acesso/Permissões</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === "incident" ? (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="impact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impacto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "medium"}>
                          <FormControl>
                            <SelectTrigger className="border-supportbox/20 focus:ring-supportbox/30">
                              <SelectValue placeholder="Impacto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixo</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="high">Alto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "medium"}>
                          <FormControl>
                            <SelectTrigger className="border-supportbox/20 focus:ring-supportbox/30">
                              <SelectValue placeholder="Urgência" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-supportbox/20 focus:ring-supportbox/30">
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        watchType === "incident"
                          ? "Por favor, descreva o problema em detalhes..."
                          : "Por favor, forneça detalhes sobre sua solicitação..."
                      }
                      className="min-h-[120px] border-supportbox/20 focus:ring-supportbox/30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {watchType === "incident"
                      ? "Inclua quaisquer mensagens de erro, quando o problema começou e passos para reproduzir."
                      : "Inclua quaisquer detalhes relevantes para sua solicitação."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={`w-full ${
                watchType === "incident" ? "bg-red-500 hover:bg-red-600" : "bg-supportbox hover:bg-supportbox-dark"
              }`}
            >
              {watchType === "incident" ? "Reportar Incidente" : "Enviar Solicitação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
