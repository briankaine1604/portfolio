"use client";
import { Button } from "@/components/button";
import { Switch } from "@/components/switch"; // Or build your own
import { useState } from "react";

export default function AdminSettingsPage() {
  // Mock states - replace with real logic
  const [darkMode, setDarkMode] = useState(true);
  const [aiDebugging, setAiDebugging] = useState(false);
  const [selfHosting, setSelfHosting] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-4 relative inline-block">
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
        <h1 className="text-2xl font-black uppercase tracking-wider">
          SETTINGS
        </h1>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance Card */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative">
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
          <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
            APPEARANCE
          </h2>
          <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Brutalist Mode</span>
              <Switch checked={true} disabled className="opacity-50" />
            </div>
          </div>
        </div>

        {/* AI Card */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-black"></div>
          <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
            AI PREFERENCES
          </h2>
          <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between">
              <span>AI Debugging Assist</span>
              <Switch
                checked={aiDebugging}
                onCheckedChange={setAiDebugging}
                className="data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-black"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-Generate Alt Text</span>
              <Switch
                checked={true}
                disabled
                className="data-[state=checked]:bg-lime-400 opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Hosting Card */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative lg:col-span-2">
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black"></div>
          <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-black pb-2">
            SELF-HOSTING
          </h2>
          <div className="space-y-6 font-mono">
            <div className="flex items-center justify-between">
              <span>Enable Self-Hosting</span>
              <Switch
                checked={selfHosting}
                onCheckedChange={setSelfHosting}
                className="data-[state=checked]:bg-lime-400 data-[state=unchecked]:bg-black"
              />
            </div>

            {selfHosting && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Coolify Instance URL</label>
                  <input
                    type="text"
                    defaultValue="https://coolify.mydomain.com"
                    className="w-full bg-white border-4 border-black p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block mb-2">Backup Frequency</label>
                  <select className="w-full bg-white border-4 border-black p-2 font-mono">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Never (living dangerously)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-black text-white border-4 border-black shadow-[12px_12px_0px_0px_#666] p-6 relative lg:col-span-2">
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 border-4 border-black transform rotate-12"></div>
          <h2 className="font-black uppercase tracking-wide mb-4 border-b-2 border-white pb-2">
            DANGER ZONE
          </h2>
          <div className="space-y-4 font-mono">
            <div className="flex justify-between items-center">
              <span>Reset All Settings</span>
              <Button className="bg-red-500 hover:bg-red-600">RESET</Button>
            </div>
            <div className="flex justify-between items-center">
              <span>Delete All Blog Posts</span>
              <Button className="bg-red-500 hover:bg-red-600">
                NUKE POSTS
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-lime-400 hover:bg-lime-300 font-mono border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          SAVE SETTINGS
        </Button>
      </div>
    </div>
  );
}
