import { HolographicPanel, HolographicCard } from "@/components/ui/HolographicPanel";
import { GlowButton } from "@/components/ui/GlowButton";
import { Disc3, Radio, Shuffle, Shirt, ExternalLink, Play, Music } from "lucide-react";
import signalIcon from "@/assets/signal-abde.png";
import livingstonerIcon from "@/assets/livingstoner-collectable.png";
import shuffleIcon from "@/assets/shuffle-pass.png";

const volumes = [
  { title: "OMEGA Back at it", color: "from-space-cyan to-glow-blue" },
  { title: "OMEGA Can't stop rep'n the L", color: "from-secondary to-space-pink" },
  { title: "OMEGA Development", color: "from-green-500 to-space-cyan" },
  { title: "OMEGA Evolution", color: "from-orange-500 to-destructive" },
];

function VolumesStation() {
  return (
    <div className="mb-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full mb-4">
          <Disc3 className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          <span className="font-body text-sm uppercase tracking-wider text-muted-foreground">
            Audio Archives
          </span>
        </div>
        <h3 className="font-display text-3xl sm:text-4xl text-foreground text-glow-cyan">
          OMEGA VOLUMES STATION
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {volumes.map((volume, index) => (
          <HolographicCard key={index} className="group perspective-1000">
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
              {/* Rotating disc effect */}
              <div className={`
                absolute inset-4 rounded-full bg-gradient-to-br ${volume.color}
                group-hover:animate-spin
                transition-all duration-300
              `} style={{ animationDuration: "3s" }}>
                {/* Center hole */}
                <div className="absolute inset-1/3 rounded-full bg-background" />
              </div>
              
              {/* Disc grooves */}
              <div className="absolute inset-4 rounded-full border border-foreground/10" />
              <div className="absolute inset-8 rounded-full border border-foreground/10" />
              <div className="absolute inset-12 rounded-full border border-foreground/10" />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary-foreground ml-1" />
                </div>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h4 className="font-display text-sm text-center text-foreground group-hover:text-primary transition-colors">
              {volume.title}
            </h4>
          </HolographicCard>
        ))}
      </div>
    </div>
  );
}

function HiddenSignalStation() {
  return (
    <div className="mb-20">
      <HolographicPanel variant="purple" className="text-center">
        <div className="flex flex-col items-center">
          {/* Signal Icon */}
          <div className="relative w-48 h-48 mb-6">
            <img 
              src={signalIcon} 
              alt="Hidden Signal" 
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(var(--secondary) / 0.6))',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-secondary/20 rounded-full mb-4">
            <Radio className="w-4 h-4 text-secondary pulse-glow" />
            <span className="font-body text-sm uppercase tracking-wider text-secondary">
              Encrypted Transmission
            </span>
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl text-foreground text-glow-purple mb-6">
            HIDDEN SIGNAL STATION
          </h3>
          
          <div className="max-w-lg mx-auto">
            <p className="font-mono text-muted-foreground glitch-text text-lg mb-6">
              &gt;&gt; DECRYPTING TRANSMISSION... &lt;&lt;
            </p>
            
            <div className="p-4 bg-muted/20 rounded-lg border border-secondary/30">
              <p className="font-mono text-secondary text-sm leading-relaxed">
                <span className="opacity-60">[ENCRYPTED]</span> Those who seek shall find...<br />
                <span className="opacity-60">[ENCRYPTED]</span> The frequency awaits...<br />
                <span className="opacity-60">[ENCRYPTED]</span> Listen between the lines...
              </p>
            </div>
          </div>
          
          <GlowButton variant="secondary" className="mt-6">
            <Music className="w-4 h-4 mr-2" />
            Tune In
          </GlowButton>
        </div>
      </HolographicPanel>
    </div>
  );
}

function ShuffleStation() {
  return (
    <div className="mb-20">
      <HolographicPanel className="text-center">
        <div className="flex flex-col items-center">
          {/* Shuffle Icon */}
          <div className="relative w-48 h-48 mb-6">
            <img 
              src={shuffleIcon} 
              alt="Shuffle Pass" 
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(var(--destructive) / 0.6))',
                animation: 'float 4s ease-in-out infinite'
              }}
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 rounded-full mb-4">
            <Shuffle className="w-4 h-4 text-primary" />
            <span className="font-body text-sm uppercase tracking-wider text-muted-foreground">
              Broadcast Control
            </span>
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl text-foreground text-glow-cyan mb-6">
            THE SHUFFLE STATION
          </h3>
          
          {/* Broadcast control visualization */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-end justify-center gap-1 h-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-primary to-glow-cyan rounded-t"
                  style={{
                    height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 30}%`,
                    animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
          
          <GlowButton variant="primary">
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle The Frequencies
          </GlowButton>
        </div>
      </HolographicPanel>
    </div>
  );
}

function DyeAloneStation() {
  return (
    <div>
      <HolographicPanel variant="blue" className="text-center">
        <div className="flex flex-col items-center">
          {/* Livingstoner Icon */}
          <div className="relative w-48 h-48 mb-6">
            <img 
              src={livingstonerIcon} 
              alt="Livingstoner Collectable" 
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(var(--glow-blue) / 0.6))',
                animation: 'float 5s ease-in-out infinite'
              }}
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-glow-blue/10 rounded-full mb-4">
            <Shirt className="w-4 h-4 text-glow-blue" />
            <span className="font-body text-sm uppercase tracking-wider text-muted-foreground">
              Fashion Terminal
            </span>
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl text-foreground text-glow-blue mb-6">
            DYE ALONE STATION
          </h3>
          
          <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
            Exclusive digital fashion collectibles. Wearable art for the metaverse.
          </p>
          
          <GlowButton variant="secondary">
            <ExternalLink className="w-4 h-4 mr-2" />
            Claim Livingstoner Collectable NFT - Coming Soon
          </GlowButton>
        </div>
      </HolographicPanel>
    </div>
  );
}

export function StationsSection() {
  return (
    <section id="stations" className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl sm:text-6xl text-foreground mb-4">
            INSIDE THE <span className="text-primary text-glow-cyan">REALM</span>
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Each station is a node in the OMEGA network. Explore. Discover. Transcend.
          </p>
        </div>
        
        <VolumesStation />
        <HiddenSignalStation />
        <ShuffleStation />
        <DyeAloneStation />
      </div>
    </section>
  );
}
