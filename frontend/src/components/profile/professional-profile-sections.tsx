"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, DollarSign, GraduationCap, MapPin, Clock, Video, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProfessionalProfileView } from "@/backend/repositories/professional-repository";

type ProfessionalProfileSectionsProps = {
  profile: ProfessionalProfileView;
};

export function ProfessionalProfileSections({ profile }: ProfessionalProfileSectionsProps) {
  return (
    <div className="space-y-6">
      {/* About Section */}
      {(profile.professionalBio || profile.description) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
              {profile.professionalBio || profile.description}
            </p>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* Services Offered */}
      {profile.specializations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Services Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.specializations.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white">{service}</h3>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* Experience */}
      {(profile.firmName || profile.totalExperienceYears) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building className="h-5 w-5 text-blue-600" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.firmName && (
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{profile.firmName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{profile.profession}</p>
                    {profile.yearsAtCurrentFirm && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {profile.yearsAtCurrentFirm} {profile.yearsAtCurrentFirm === 1 ? 'year' : 'years'} at this firm
                      </p>
                    )}
                    {profile.firmAddress && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span>{profile.firmAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {profile.totalExperienceYears && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">{profile.totalExperienceYears}</span> years of total professional experience
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* Credentials & Education */}
      {(profile.education || profile.certifications || profile.licenseNumber) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Credentials & Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Education Box */}
              {profile.education && (
                <div className="rounded-lg border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-blue-900 dark:text-blue-100">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Education
                  </h3>
                  <div className="space-y-2">
                    {profile.education.split('\n').map((edu, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credentials Box */}
              {(profile.certifications || profile.licenseNumber) && (
                <div className="rounded-lg border-2 border-amber-100 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-800 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-amber-900 dark:text-amber-100">
                    <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Credentials
                  </h3>
                  <div className="space-y-4">
                    {profile.certifications && (
                      <div className="space-y-2">
                        {profile.certifications.split('\n').map((cert, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{cert}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {profile.licenseNumber && (
                      <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 p-3">
                        <h4 className="mb-2 text-xs font-semibold text-amber-900 dark:text-amber-100 uppercase tracking-wide">Professional License</h4>
                        <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                          <p><span className="font-medium text-slate-900 dark:text-white">License #:</span> {profile.licenseNumber}</p>
                          {profile.licensingBody && (
                            <p><span className="font-medium text-slate-900 dark:text-white">Body:</span> {profile.licensingBody}</p>
                          )}
                          {profile.licenseJurisdiction && (
                            <p><span className="font-medium text-slate-900 dark:text-white">Jurisdiction:</span> {profile.licenseJurisdiction}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* Pricing & Consultation Info */}
      {(profile.hourlyRate || profile.minRate || profile.maxRate || profile.pricingModel) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Pricing & Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.pricingModel && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pricing Model</h3>
                  <p className="mt-1 text-slate-900 dark:text-white">{profile.pricingModel}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {profile.hourlyRate && (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Hourly Rate</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">${profile.hourlyRate}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">per hour</p>
                  </div>
                )}

                {(profile.minRate || profile.maxRate) && (
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Rate Range</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                      ${profile.minRate || 0} - ${profile.maxRate || 0}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">typical range</p>
                  </div>
                )}
              </div>

              {profile.pricingDetails && (
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{profile.pricingDetails}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {profile.offersInPerson ? 'In-Person Available' : 'No In-Person'}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Video className="h-3 w-3" />
                  {profile.offersRemote ? 'Virtual Available' : 'No Virtual'}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {profile.acceptsNewClients ? 'Accepting New Clients' : 'Not Accepting Clients'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}
    </div>
  );
}
