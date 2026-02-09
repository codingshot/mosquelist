import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PageSEO } from "@/components/PageSEO";
import { User, Camera, Clock, Heart, Info, Droplets, BookOpen, Globe, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VisitorTipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Mosque Visitor Tips - Etiquette, Dress Code, Ablution & Photography | MosqueList"
        description="Essential visitor tips for mosques: dress code, etiquette, ablution (wudu), photography rules, and best times. A respectful guide for non-Muslim and Muslim visitors alike."
        path="/guides/visitor-tips"
      />
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 pt-20 pb-12 md:py-24">
        <article className="max-w-3xl mx-auto">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full mb-6 border border-border">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Visitor Guide</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Mosque Visitor Tips
            </h1>
            <p className="text-lg text-muted-foreground">
              Essential etiquette, dress code, and practical tips for visiting
              mosques. Whether you're Muslim or a respectful tourist, these
              guidelines help you experience these sacred spaces properly.
            </p>
          </header>

          <TooltipProvider>
            <div className="prose prose-lg max-w-none space-y-10 break-words">
              {/* Dress Code */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Dress Code
                </h2>
                <p className="text-muted-foreground mt-3">
                  Modest dress is required: long sleeves, trousers or long skirts
                  (ankle-length), and covered shoulders. Women should bring or wear
                  a headscarf. Many mosques provide abayas, robes, or scarves at
                  the entrance. Remove shoes before entering the prayer area—use
                  provided shelves or carry a bag for them.
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Quick Checklist</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Long sleeves covering arms</li>
                    <li>✓ Trousers/skirt covering ankles</li>
                    <li>✓ Headscarf for women (often provided)</li>
                    <li>✓ Socks (floors can be cold)</li>
                    <li>✓ Bag for shoes if no shelves available</li>
                  </ul>
                </div>
              </section>

              {/* Ablution (Wudu) */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-primary" />
                  Ablution (Wudu)
                </h2>
                <p className="text-muted-foreground mt-3">
                  <Tooltip>
                    <TooltipTrigger className="underline decoration-dotted cursor-help">
                      Wudu
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Wudu (الوضوء) is the Islamic ritual washing performed before prayer. It involves washing specific body parts in a prescribed order.</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  is the ritual purification Muslims perform before prayer. Most mosques
                  have dedicated ablution areas with running water, separate for men and women.
                  Non-Muslims visiting as tourists don't need to perform wudu, but understanding
                  the practice helps you appreciate mosque culture.
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Steps of Wudu (for reference)</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Wash hands three times</li>
                    <li>Rinse mouth three times</li>
                    <li>Clean nose three times</li>
                    <li>Wash face three times</li>
                    <li>Wash arms to elbows three times</li>
                    <li>Wipe head once</li>
                    <li>Clean ears once</li>
                    <li>Wash feet to ankles three times</li>
                  </ol>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  <strong>Tip:</strong> Ablution facilities are often located near mosque
                  entrances. Look for{" "}
                  <Tooltip>
                    <TooltipTrigger className="underline decoration-dotted cursor-help">
                      "Wudu Khana"
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Urdu/Arabic term for "ablution area" or "washing room"</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  signs or ask staff.
                </p>
              </section>

              {/* Etiquette */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Etiquette
                </h2>
                <p className="text-muted-foreground mt-3">
                  Be quiet and respectful. Avoid walking in front of someone
                  praying. Don't touch the Qur'an or religious texts without
                  ablution. Turn off phone ringers. Some mosques restrict
                  non-Muslim visitors to certain areas or hours—check before
                  visiting.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="text-sm font-semibold text-primary mb-2">Do</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Speak softly</li>
                      <li>• Sit or stand quietly</li>
                      <li>• Ask permission before photos</li>
                      <li>• Follow staff guidance</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <h3 className="text-sm font-semibold text-destructive mb-2">Don't</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Walk in front of worshippers</li>
                      <li>• Touch religious items</li>
                      <li>• Eat or drink inside</li>
                      <li>• Use flash photography</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Photography */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Camera className="w-6 h-6 text-primary" />
                  Photography
                </h2>
                <p className="text-muted-foreground mt-3">
                  Many mosques allow photography, but rules vary. Avoid photographing
                  worshippers without permission. Flash is usually discouraged.
                  Some areas (e.g., women's sections, certain shrines) prohibit
                  photography entirely. When in doubt, ask. Tourism-friendly
                  mosques like Sheikh Zayed and Hassan II often permit photos in
                  designated areas.
                </p>
              </section>

              {/* Best Times */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Best Times to Visit
                </h2>
                <p className="text-muted-foreground mt-3">
                  Visit outside the five daily{" "}
                  <Tooltip>
                    <TooltipTrigger className="underline decoration-dotted cursor-help">
                      prayer times
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p><strong>Fajr</strong> (dawn), <strong>Dhuhr</strong> (midday), <strong>Asr</strong> (afternoon), <strong>Maghrib</strong> (sunset), <strong>Isha</strong> (night)</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  for a quieter experience. Mosques often close to non-Muslims 30 minutes 
                  before and during prayer. Friday midday prayer (
                  <Tooltip>
                    <TooltipTrigger className="underline decoration-dotted cursor-help">
                      Jumu'ah
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The congregational Friday prayer, the most important weekly gathering for Muslims</p>
                    </TooltipContent>
                  </Tooltip>
                  ) is the busiest—avoid if you want a calmer visit. Early morning or late 
                  afternoon are generally good.
                </p>
              </section>

              {/* Access Restrictions */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Access Restrictions
                </h2>
                <p className="text-muted-foreground mt-3">
                  Some mosques have restricted access for non-Muslims. The{" "}
                  <Tooltip>
                    <TooltipTrigger className="underline decoration-dotted cursor-help">
                      Two Holy Mosques
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Masjid al-Haram (Mecca) and Al-Masjid an-Nabawi (Medina) are exclusively for Muslims</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  in Mecca and Medina are only open to Muslims. Parts of Al-Aqsa 
                  compound have varying restrictions. Always research specific 
                  mosques before visiting.
                </p>
                <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-border">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Security Note</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Major mosques may have security checkpoints. Carry ID and be 
                        prepared for bag searches. Some sites prohibit large bags or 
                        certain electronics.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Common Terms */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Common Terms
                </h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { term: "Masjid", def: "Mosque (place of prostration)" },
                    { term: "Mihrab", def: "Prayer niche indicating Mecca's direction" },
                    { term: "Minbar", def: "Pulpit for Friday sermons" },
                    { term: "Minaret", def: "Tower for calling to prayer" },
                    { term: "Qibla", def: "Direction of prayer (toward Mecca)" },
                    { term: "Imam", def: "Prayer leader" },
                    { term: "Adhan", def: "Call to prayer" },
                    { term: "Salah", def: "The five daily prayers" },
                  ].map(({ term, def }) => (
                    <div key={term} className="p-3 bg-muted/50 rounded-lg border border-border">
                      <span className="font-medium text-foreground">{term}</span>
                      <span className="text-muted-foreground"> — {def}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cultural Sensitivity */}
              <section>
                <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-6 h-6 text-primary" />
                  Cultural Sensitivity
                </h2>
                <p className="text-muted-foreground mt-3">
                  Mosques are active places of worship, not just tourist sites. 
                  Your respectful behavior helps maintain good relations between 
                  communities. If you're unsure about anything, ask—most mosque 
                  staff welcome curious and respectful visitors.
                </p>
                <p className="text-muted-foreground mt-3">
                  Consider visiting during guided tours offered by many major 
                  mosques. These provide deeper insight into Islamic architecture, 
                  history, and practice while ensuring appropriate conduct.
                </p>
              </section>
            </div>
          </TooltipProvider>

          <footer className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              For step-by-step wudu and how to pray or follow prayer respectfully, see our blog:{" "}
              <Link to="/blog/how-to-perform-wudu-before-entering-mosque" className="text-primary hover:underline">
                How to Perform Wudu
              </Link>
              {" "}and{" "}
              <Link to="/blog/how-to-pray-in-mosque-respectful-guide" className="text-primary hover:underline">
                How to Pray in a Mosque
              </Link>
              .
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              For travel planning and popular routes, see our{" "}
              <Link to="/guides/travel" className="text-primary hover:underline">
                Travel Guide
              </Link>
              . Explore our{" "}
              <Link to="/explore" className="text-primary hover:underline">
                199+ mosques in 50+ countries
              </Link>{" "}
              to find visitor-friendly mosques.
            </p>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/explore">Browse Mosques</Link>
            </Button>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
