export default function Loading() {
	return (
		<div className="mx-auto w-full max-w-3xl px-6 md:px-8">
			<div className="mb-4 h-9 w-2/3 animate-pulse rounded bg-muted" />
			<div className="mb-2 h-4 w-40 animate-pulse rounded bg-muted" />
			<div className="mb-6 flex gap-2">
				<div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
				<div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
			</div>
			<div className="space-y-3">
				{[...Array(8)].map((_, i) => (
					<div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
				))}
			</div>
		</div>
	);
}




