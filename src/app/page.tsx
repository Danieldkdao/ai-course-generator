import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Globe,
  Layers3,
  PlayCircle,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingTable } from "@/services/clerk/components/pricing-table";

const features = [
  {
    title: "AI course layout engine",
    description:
      "Generate a structured outline from topic, difficulty, duration, and chapter count in minutes.",
    Icon: Layers3,
  },
  {
    title: "Long-form lesson generation",
    description:
      "Create detailed chapter content that reads like a finished instructor guide.",
    Icon: BookOpen,
  },
  {
    title: "Built-in content reviews",
    description:
      "Auto-generated quizzes keep learners aligned and help validate mastery.",
    Icon: ClipboardCheck,
  },
  {
    title: "Optional YouTube embeds",
    description:
      "Attach relevant videos per chapter to support visual learning paths.",
    Icon: PlayCircle,
  },
  {
    title: "Public or private sharing",
    description:
      "Toggle visibility and share a clean course URL with a single click.",
    Icon: Globe,
  },
  {
    title: "Community explore feed",
    description:
      "Browse and learn from public courses built by other creators.",
    Icon: Sparkles,
  },
];

const stats = [
  { value: "500+", label: "Courses generated (example metric)" },
  { value: "3x", label: "Faster course planning (example metric)" },
  { value: "92%", label: "Creator satisfaction (example metric)" },
  { value: "24/7", label: "Idea-to-course creation" },
];

const testimonials = [
  {
    name: "Janelle Ford",
    role: "Learning Designer",
    quote:
      "AlphaWave took a raw topic and delivered a full syllabus I could ship the same day.",
  },
  {
    name: "Ravi Patel",
    role: "Engineering Lead",
    quote:
      "We used it to turn internal docs into a polished onboarding course with quizzes.",
  },
  {
    name: "Monica Reyes",
    role: "Creator",
    quote:
      "The shareable course links made collaboration effortless across my teaching team.",
  },
];

const steps = [
  { title: "Drop a topic", description: "Describe your course in a sentence." },
  {
    title: "Tune the specs",
    description: "Pick difficulty, duration, chapters, and videos.",
  },
  {
    title: "Publish fast",
    description: "Get layout, lessons, and quizzes ready to share.",
  },
];

const Page = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-[32rem] w-lg rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-48 left-0 h-[28rem] w-md rounded-full bg-secondary/40 blur-3xl" />
        </div>

        <header className="container flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">AlphaWave</span>
            <Badge variant="secondary">AI Course Studio</Badge>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#features" className="hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="#testimonials" className="hover:text-primary">
              Stories
            </Link>
            <Link href="/app">Sign In</Link>
          </nav>
          <Button asChild className="hidden md:inline-flex">
            <Link href="/app">Create your first course</Link>
          </Button>
        </header>

        <section className="container grid gap-10 pb-20 pt-12 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-primary/10 text-primary">
              AI-powered course creation
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              AI course creation in minutes, built for modern creators.
            </h1>
            <p className="text-lg text-muted-foreground">
              AlphaWave turns a topic into a full course layout, long-form
              lessons, quizzes, and optional video embeds so you can ship
              quality learning fast.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="gap-2">
                <Link href="/app">
                  Generate a course <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/app/explore">Explore courses</Link>
              </Button>
            </div>
            <div className="grid gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Course preview
                </p>
                <h2 className="text-xl font-semibold">Design Systems 101</h2>
              </div>
              <Badge variant="outline">Public</Badge>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border bg-muted/40 p-3">
                <p className="text-sm font-semibold">Chapter 1: Foundations</p>
                <p className="text-xs text-muted-foreground">
                  Tokens, scale, and accessibility baselines.
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/40 p-3">
                <p className="text-sm font-semibold">Chapter 2: Components</p>
                <p className="text-xs text-muted-foreground">
                  Build composable pieces with clear API rules.
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/40 p-3">
                <p className="text-sm font-semibold">Quick quiz</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />3 questions
                  ready to validate learning.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="container py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">
              Features
            </p>
            <h2 className="text-3xl font-semibold">
              Everything you need to build and share a course.
            </h2>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            Deliver consistent learning experiences with structured layouts,
            detailed content, and the tools to publish confidently.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <div className="rounded-3xl border bg-card p-10 shadow-sm">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl font-semibold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="container py-20">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Testimonials
          </p>
          <h2 className="text-3xl font-semibold">
            Creators move faster with AlphaWave.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <p className="text-sm text-muted-foreground">"{item.quote}"</p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="container py-20">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-3xl font-semibold">Pick a plan that scales.</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Start free with 5 course generations and up to 4 chapters per
            course. Upgrade to Pro for unlimited generations and unlimited
            chapters.
          </p>
        </div>
        <div className="mt-10">
          <PricingTable />
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-3xl border bg-linear-to-br from-primary to-secondary px-8 py-12 text-primary-foreground shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold">
                Build your next course in a single afternoon.
              </h2>
              <p className="text-sm text-primary-foreground/80">
                Start free, publish fast, and upgrade anytime.
              </p>
            </div>
            <Button asChild variant="secondary" className="gap-2">
              <Link href="/app">
                Create your first course <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              AlphaWave
            </div>
            <p className="text-sm text-muted-foreground">
              AI-first course creation for modern teams.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="#features">Product</Link>
            <Link href="/app/explore">Explore</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="/app">Support</Link>
            <Link href="/app">Terms</Link>
            <Link href="/app">Privacy</Link>
            <Link href="/app">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
