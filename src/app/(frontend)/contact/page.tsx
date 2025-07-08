"use client";

import { Button } from "@/components/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const trpc = useTRPC();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const sendEmail = useMutation(
    trpc.contact.sendEmail.mutationOptions({
      onSuccess: () => {
        toast.success("MESSAGE SENT! CHECK YOUR EMAIL FOR CONFIRMATION.");
        reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const onSubmit = (data: ContactForm) => {
    sendEmail.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-8 relative inline-block">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black"></div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-wider">
              LET&apos;S TALK
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-lime-400 border-2 border-black"></div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-6 border-b-2 border-black pb-2">
                GET IN TOUCH
              </h2>
              <div className="space-y-4 font-mono text-sm">
                <p className="uppercase">
                  GOT A PROJECT? AN IDEA? OR JUST WANT TO CHAT ABOUT CODE? DROP
                  ME A LINE AND LET&apos;S BUILD SOMETHING AWESOME TOGETHER.
                </p>
                <div className="pt-4 space-y-2">
                  <div className="font-black">EMAIL:</div>
                  <div className="text-xs">INFO@BRIANKAINE.COM</div>
                  <div className="font-black pt-2">LOCATION:</div>
                  <div className="text-xs">PORT HARCOURT / LAGOS, NIGERIA</div>
                  <div className="font-black pt-2">RESPONSE TIME:</div>
                  <div className="text-xs">USUALLY WITHIN 24 HOURS</div>
                </div>
              </div>
            </div>

            <div className="bg-lime-400 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 relative">
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black"></div>
              <div className="font-black uppercase text-sm mb-2">
                AVAILABILITY
              </div>
              <div className="font-mono text-xs">
                OPEN TO FREELANCE PROJECTS & COLLABORATIONS
              </div>
            </div>

            <div className="bg-gray-900 text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-6">
              <div className="font-black uppercase text-sm mb-4">
                FIND ME ONLINE
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="space-y-2">
                  {/* <a
                  href="https://github.com/briankaine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-300 transition-colors"
                >
                  GITHUB
                </a> */}
                  <a
                    href="https://www.linkedin.com/in/brian-ikeogu-876023199/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-mono text-sm uppercase tracking-wide hover:text-gray-300 transition-colors"
                  >
                    LINKEDIN
                  </a>
                  {/* <a
                  href="https://twitter.com/briankaine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-300 transition-colors"
                >
                  TWITTER
                </a> */}
                  <a
                    href="mailto:info@briankaine.com"
                    className="block font-mono text-sm uppercase tracking-wide hover:text-gray-300 transition-colors"
                  >
                    EMAIL
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 relative">
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black transform rotate-45"></div>
              <h2 className="text-xl font-black uppercase tracking-wide mb-8 border-b-2 border-black pb-2">
                SEND MESSAGE
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block font-black uppercase text-sm mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="YOUR NAME HERE"
                    className={`w-full border-4 border-black p-3 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-red-500 font-mono text-xs uppercase">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-black uppercase text-sm mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="YOUR.EMAIL@DOMAIN.COM"
                    className={`w-full border-4 border-black p-3 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 font-mono text-xs uppercase">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-black uppercase text-sm mb-2">
                    SUBJECT *
                  </label>
                  <input
                    type="text"
                    {...register("subject")}
                    placeholder="WHAT'S THIS ABOUT?"
                    className={`w-full border-4 border-black p-3 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] ${
                      errors.subject ? "border-red-500" : ""
                    }`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-red-500 font-mono text-xs uppercase">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block font-black uppercase text-sm mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="TELL ME ABOUT YOUR PROJECT, IDEA, OR JUST SAY HI..."
                    className={`w-full border-4 border-black p-3 font-mono text-sm bg-gray-50 focus:bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] resize-none ${
                      errors.message ? "border-red-500" : ""
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-red-500 font-mono text-xs uppercase">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={sendEmail.isPending}
                    variant="inverse"
                    className={`bg-lime-400 w-full lg:w-auto ${
                      sendEmail.isPending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {sendEmail.isPending ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-16 bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-lime-400 border-4 border-black"></div>
          <blockquote className="font-mono text-sm max-w-2xl mx-auto">
            &quot;EVERY GREAT PROJECT STARTS WITH A CONVERSATION. LET&apos;S
            MAKE YOURS THE NEXT SUCCESS STORY.&quot;
          </blockquote>
        </div>
      </div>
    </div>
  );
}
