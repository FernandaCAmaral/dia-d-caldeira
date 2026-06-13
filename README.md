# 🚀 Caldeira Workshop Guide (MVP)

Aplicação web desenvolvida como **MVP demonstrativo para o workshop da FIAP**, em parceria com o **Instituto Caldeira**, com mentoria do instrutor **Sandro Martins da Costa**.

Este projeto simula um sistema real de apoio à navegação e orientação de participantes em eventos de grande escala (1.000+ pessoas), como workshops presenciais realizados no campus do Instituto Caldeira.

---

## 📌 Sobre o Projeto

O **Caldeira Workshop Guide** é uma plataforma pensada para resolver um problema comum em eventos de grande porte:  
> “Como ajudar cada participante a encontrar rapidamente seu local, seu guia e sua programação personalizada dentro do evento?”

Após autenticação simples via e-mail e código OTP, o usuário acessa um **dashboard personalizado** com:

- Seu workshop
- Sala exata do evento
- Guia responsável
- Rota interna dentro do Instituto Caldeira
- Agenda do dia

---

## 🧠 Contexto Acadêmico

Este projeto foi desenvolvido como parte de um **MVP educacional da FIAP**, em colaboração com o **Instituto Caldeira**, simulando um cenário real de alta escala logística em eventos presenciais.

O objetivo é demonstrar conceitos de:

- UX para eventos de grande escala
- Arquitetura de software moderna (frontend + backend serverless)
- Integração de dados entre sistemas de inscrição e experiência do usuário
- Design de fluxos de navegação orientados a contexto
- Experiência mobile-first

---

## 🎯 Objetivo do MVP

Criar uma aplicação funcional que:

- Valide participantes via e-mail + OTP
- Integre (ou simule integração) com base de inscrições de workshops
- Mostre informações personalizadas por usuário
- Oriente fisicamente o participante dentro do Instituto Caldeira
- Reduza atrito e confusão em eventos com alto fluxo de pessoas

---

## 🧩 Funcionalidades

### 🔐 Autenticação
- Login via e-mail
- Validação por código OTP
- Simulação de integração com base de inscrições

### 🧑‍💼 Dashboard do Participante
- Nome e dados do participante
- Workshop inscrito
- Sala e localização
- Guia responsável
- Horário do evento

### 🗺️ Sistema de Navegação
- Mapa simplificado do Instituto Caldeira
- Rota passo a passo até a sala
- Tempo estimado de deslocamento
- Instruções claras de percurso

### 📅 Agenda
- Timeline do evento
- Horários importantes
- Atividades complementares

### 🆘 Suporte
- FAQ
- Contato da organização
- Acesso rápido à recepção

---

## 🧱 Arquitetura do Sistema

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS

### Backend (simulado / preparado)
- Supabase (Auth + DB + Storage)
- RLS (Row Level Security)
- Integração preparada com APIs externas

### Integrações previstas
- API de inscrições de workshops
- Webhooks
- Importação via CSV

---

## 📊 Modelagem de Dados (resumo)

- **Participante**
  - dados pessoais + workshop + guia

- **Workshop**
  - nome, horário, sala

- **Guia**
  - responsável pelo grupo

- **Sala**
  - localização física no Instituto

- **Evento**
  - estrutura geral do workshop

- **Agenda**
  - cronograma do evento

---

## 🔁 Fluxo do Usuário

1. Acessa landing page
2. Informa e-mail
3. Recebe e valida OTP
4. Acessa dashboard personalizado
5. Visualiza:
   - workshop
   - guia
   - sala
   - rota interna
6. Consulta agenda e suporte quando necessário

---

## 📱 Design System

Inspirado em produtos modernos como:

- Notion
- Stripe
- Linear
- Apple

Características:

- UI clean e minimalista
- Mobile-first
- Alto contraste e legibilidade
- Componentes modulares
- Feedbacks visuais claros

---

## 🧪 Status do Projeto

> MVP funcional (protótipo navegável)

Este projeto não é um sistema de produção completo, mas sim uma **demonstração funcional de conceito (POC/MVP)** para validação de ideia, arquitetura e UX.

---

## 🚀 Possíveis Evoluções

- Mapa indoor com geolocalização
- Chat com guia em tempo real
- Notificações push durante o evento
- Painel administrativo para organizadores
- Analytics de fluxo de pessoas
- Gamificação da experiência
- Integração com certificados digitais

---

## 👨‍🏫 Créditos

Projeto desenvolvido no contexto acadêmico da **FIAP**, em parceria com o **Instituto Caldeira**, sob orientação do instrutor:

**[eisandromc](https://github.com/eisandromc)**

---

## 📌 Observação Final

Este projeto simula um sistema real de alto impacto logístico em eventos educacionais e foi construído com foco em:

- Escalabilidade conceitual
- Experiência do usuário
- Arquitetura moderna
- Clareza de fluxo em ambientes complexos
