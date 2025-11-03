"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", label: "Recent" },
	{ href: "/blog", label: "All posts" },
	{ href: "/categories", label: "Categories" },
	{ href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
			<Container>
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="text-base font-semibold tracking-tight">
						Blog Platform
					</Link>

					<nav className="hidden gap-6 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"text-sm text-muted-foreground transition-colors hover:text-foreground"
								)}
							>
								{item.label}
							</Link>
						))}
					</nav>

					<button
						className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
						aria-label="Toggle menu"
						onClick={() => setOpen((v) => !v)}
					>
						{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</Container>

			{open && (
				<div className="border-t bg-background md:hidden">
					<Container>
						<div className="flex flex-col py-2">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted"
									onClick={() => setOpen(false)}
								>
									{item.label}
								</Link>
							))}
						</div>
					</Container>
				</div>
			)}
		</header>
	);
}

