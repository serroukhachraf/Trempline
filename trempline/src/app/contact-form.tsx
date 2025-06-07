"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

// Ceci et pour stocker les informations du formulaire
export default function ContactForm() {
  const [selectedGender, setSelectedGender] = useState("mme")
  const [selectedMessageType, setSelectedMessageType] = useState("visite")
  const [availabilities, setAvailabilities] = useState<string[]>([])
  const [selectedDay, setSelectedDay] = useState("lundi")
  const [selectedHour, setSelectedHour] = useState("9h")
  const [selectedMinute, setSelectedMinute] = useState("0m")

  // Ceci et pour stocker les données personnelles
  const [lastName, setLastName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  // cette fonction sert pour ajouter une nouvelle disponibilité 
  const addAvailability = () => {
    const newAvailability = `${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} à ${selectedHour}${selectedMinute === "0m" ? "" : selectedMinute}`
    setAvailabilities([...availabilities, newAvailability])
  }

  // cette fonction sert pour suprimmer une disponibilité 
  const removeAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index))
  }

  // cette fonction pour gérer l'envoi du formulaire
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
      // Envoie des données vers l'API Next.js via une requête POST
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        alert("Message envoyé avec succès !")
        // Réinitialisation des champs après l'envoi
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
