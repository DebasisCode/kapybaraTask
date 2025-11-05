import Link from "next/link";
import Container from "@/components/layout/Container";

export default function Footer() {
	return (
		<footer className="border-t py-8 text-sm text-muted-foreground">
			<Container>
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<p>&copy; {new Date().getFullYear()} Blogging Platform. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link className="hover:text-foreground" href="/blog">All posts</Link>
						<Link className="hover:text-foreground" href="/dashboard">Dashboard</Link>
					</div>
				</div>
			</Container>
		</footer>
	);
}





