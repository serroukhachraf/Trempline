
# Tremplin Project

C'est Un Projet Test et ceci la documentation des étapes du réalisation.

## Installation NextJS

```
npx create-next-app@latest
```

## Configuration du DB

Installation Prisma

```
npm install prisma --save-dev
```
@prisma/client permet d'interagir avec la base de données

```
npm install @prisma/client
```
Cette commande sert pour intialiser prisma dans notre projet
```
npx prisma init
```
Aprés la création automatique du fichier .env on doit configurer notre URL.
```
DATABASE_URL="mysql://root:verysecurepassword@localhost:3306/trempline"
```
Dans notre cas on a intégrer "user / password" dans la documentation car ceci et juste un test. {NOTE / Les données sensibles doivent être protégées et conservées de manière confidentielle.}

## Définir la Schema Prisma

```
model ContactMessage {
  id            Int      @id @default(autoincrement())
  gender        String
  lastName      String
  firstName     String
  email         String
  phone         String
  messageType   String
  message       String
  availabilities String
  createdAt     DateTime @default(now())
}
```

## Migration de notre table.

```
npx prisma migrate dev --name init
```

## Creation du fichier Prisma.ts

```
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```
Ce fichier nous permet de faciliter l'utilisation du prisma dans tous le projet

## Creation du fichier route.ts

```
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Simple email regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Email validation
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // Phone validation: only numbers (allow optional + at start)
    if (!/^\+?\d+$/.test(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number should contain only numbers.' },
        { status: 400 }
      );
    }

    // Save to database
    const contact = await prisma.contactMessage.create({
      data: {
        gender: body.gender,
        lastName: body.lastName,
        firstName: body.firstName,
        email: body.email,
        phone: body.phone,
        messageType: body.messageType,
        message: body.message,
        availabilities: JSON.stringify(body.availabilities),
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
```
ce fichier et le "Handler" De notre api sur la quelle on a définir la méthod POST de notre application pour stocker les données dans la base de données

## FrontEnd

```
"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export default function ContactForm() {
  const [selectedGender, setSelectedGender] = useState("mme")
  const [selectedMessageType, setSelectedMessageType] = useState("visite")
  const [availabilities, setAvailabilities] = useState<string[]>([])
  const [selectedDay, setSelectedDay] = useState("lundi")
  const [selectedHour, setSelectedHour] = useState("9h")
  const [selectedMinute, setSelectedMinute] = useState("0m")

  // New form fields
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const addAvailability = () => {
    const newAvailability = `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} à ${selectedHour}${selectedMinute === "0m" ? "" : selectedMinute}`
    setAvailabilities([...availabilities, newAvailability])
  }

  const removeAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const payload = {
      gender: selectedGender,
      lastName,
      firstName,
      email,
      phone,
      messageType: selectedMessageType,
      message,
      availabilities,
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        alert("Message envoyé avec succès !")
        // Optionally reset fields
        setLastName("")
        setFirstName("")
        setEmail("")
        setPhone("")
        setMessage("")
        setAvailabilities([])
      } else {
        alert("Erreur : " + data.error)
      }
    } catch (err) {
      console.error("Submit error:", err)
      alert("Une erreur s'est produite.")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/salon.png"
          alt="Modern interior dining room"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 max-w-4xl w-full">
          <h1 className="text-white text-3xl font-bold mb-8">CONTACTEZ L'AGENCE</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-white text-lg font-semibold mb-4">VOS COORDONNÉES</h2>

                <div className="flex gap-4 mb-4">
                  {["mme", "m"].map((gender) => (
                    <div className="flex items-center space-x-2" key={gender}>
                      <input
                        type="radio"
                        id={gender}
                        name="gender"
                        value={gender}
                        checked={selectedGender === gender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="w-4 h-4 text-white"
                      />
                      <Label htmlFor={gender} className="text-white">
                        {gender === "mme" ? "Mme" : "M."}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Nom"
                    className="bg-white/90 border-0 rounded-full px-4 py-3"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Input
                    placeholder="Prénom"
                    className="bg-white/90 border-0 rounded-full px-4 py-3"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <Input
                  type="email"
                  placeholder="Adresse mail"
                  className="bg-white/90 border-0 rounded-full px-4 py-3 mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="tel"
                  placeholder="Téléphone"
                  className="bg-white/90 border-0 rounded-full px-4 py-3"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <h2 className="text-white text-lg font-semibold mb-4">DISPONIBILITÉS POUR UNE VISITE</h2>

                <div className="flex gap-2 mb-4">
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="bg-white/90 border-0 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"].map((day) => (
                        <SelectItem value={day} key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedHour} onValueChange={setSelectedHour}>
                    <SelectTrigger className="bg-white/90 border-0 rounded-full w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                        <SelectItem key={hour} value={`${hour}h`}>
                          {hour}h
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                    <SelectTrigger className="bg-white/90 border-0 rounded-full w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["0m", "15m", "30m", "45m"].map((min) => (
                        <SelectItem key={min} value={min}>{min}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mb-4">
                  {availabilities.map((availability, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/20 rounded-full px-4 py-2">
                      <span className="text-white text-sm">{availability}</span>
                      <button onClick={() => removeAvailability(index)} className="text-white hover:text-red-300">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={addAvailability}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 text-sm font-medium"
                >
                  AJOUTER DISPO
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-white text-lg font-semibold mb-4">VOTRE MESSAGE</h2>

                <div className="flex flex-wrap gap-4 mb-4">
                  {["visite", "rappel", "photos"].map((type) => (
                    <div className="flex items-center space-x-2" key={type}>
                      <input
                        type="radio"
                        id={type}
                        name="messageType"
                        value={type}
                        checked={selectedMessageType === type}
                        onChange={(e) => setSelectedMessageType(e.target.value)}
                        className="w-4 h-4 text-white"
                      />
                      <Label htmlFor={type} className="text-white text-sm">
                        {type === "visite"
                          ? "Demande de visite"
                          : type === "rappel"
                          ? "Être rappelé.e"
                          : "Plus de photos"}
                      </Label>
                    </div>
                  ))}
                </div>

                <Textarea
                  placeholder="Votre message"
                  className="bg-white/90 border-0 rounded-2xl px-4 py-3 min-h-[200px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3 text-lg font-semibold"
                >
                  ENVOYER
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```
Pour installer les components :

```
 npx shadcn@latest add radio-group
 npx shadcn@latest add button
 npx shadcn@latest add input
 npx shadcn@latest add textarea
 npx shadcn@latest add select
 npx shadcn@latest add label
```
## Screenshots

https://drive.google.com/file/d/1v3tE0_V8YSSJik47jz4xswHyQN9TCavL/view?usp=sharing
https://drive.google.com/file/d/1VY2dXdS5tVUmS4GRKbgaGU_eEUSE2jNj/view?usp=sharing
https://drive.google.com/file/d/1E6IyZPVoTtrjJhQqkwDJTUgTtU9bEHy6/view?usp=sharing
https://drive.google.com/file/d/1ZCUDL9shttn01t3adyNChFCwiZdWDmKN/view?usp=sharing


## Authors

- [@AchrafSerroukh](https://github.com/serroukhachraf)

