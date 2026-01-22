"use client"
import sendEmail from '@/app/aws/sendEmail';
import Head from 'next/head';
import { useState } from 'react';
import { toast } from 'sonner'; // Assurez-vous d'avoir importé correctement le module sonner

/**
 * Page de contact
 */
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  /**
   * Récupère les nouvelles valeurs du formulaire lors de modification
   * @param e évenement déclenché lors de la modification de la valeur d'un input (saisi de l'utilisateur)
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  /**
   * Gère la soumission du formulaire
   * @param e évenement déclenché lors de la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si les champs sont remplis
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Veuillez remplir tous les champs du formulaire.');
      return;
    }

    try {
        const emailParams: AWS.SES.SendEmailRequest = {
          Source: process.env.NEXT_PUBLIC_AWS_EMAIL_VERIFIED??'', 
          Destination: {
            ToAddresses: [process.env.NEXT_PUBLIC_AWS_EMAIL_VERIFIED??''??''],
          },
          Message: {
            Subject: {
              Data: `Nouveau message de contact  ${formData.email}`,
            },
            Body: {
              Text: {
                Data: `Nom :  ${formData.name}\n Email :  ${formData.email}\n Message :  ${formData.message}`,
              },
            },
          },
        };
  
        await sendEmail(emailParams);
  
        toast.success('Message envoyé avec succès !');
  
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire :', error);
        toast.error('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
      }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Contactez-nous - Ugram</title>
        <meta name="description" content="Contactez-nous pour toute question ou commentaire." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4 text-indigo-700">Contact us</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700">Nom</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border  border-gray-300 focus:outline-indigo-600 p-2 rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm  border  border-gray-300 focus:outline-indigo-600 p-2 rounded-md" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="mt-1 focus:outline-indigo-600 block w-full shadow-sm border border-gray-300 rounded-md"></textarea>
            </div>
            <br></br>
            <div className="flex justify-center">
              <button type="submit" className="inline-flex items-center justify-center text-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 w-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} Uimages - All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;