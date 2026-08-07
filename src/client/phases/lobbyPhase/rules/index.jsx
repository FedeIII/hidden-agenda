import { Fragment, useEffect, useState } from 'react';
import { Button, Buttons } from 'Client/components/button';
import { Subtitle } from 'Client/components/title';
import { RULES_PAGES, GROUPS, findRulePage } from './content';
import {
	RulesPanel,
	RulesIntro,
	PageHead,
	PageHeadTitle,
	HeadStep,
	CheatSheetLink,
	CheatSheetLinkTitle,
	CheatSheetLinkTeaser,
	CheatGrid,
	CheatSection,
	CheatHeading,
	CheatIntro,
	CheatList,
	GroupHeading,
	RuleCardList,
	RuleCard,
	RuleCardTitle,
	RuleCardTeaser,
	RuleContent,
	RuleBody,
	RuleList,
	RuleNote,
	BuffBadge,
	RuleTable,
	ExhibitFrame,
	ExhibitTape,
	ExhibitImage,
	ExhibitTag,
	ExhibitLabel,
	ExhibitCaption,
	ExhibitPairFrame,
	ExhibitPairRow,
	ExhibitPairColumn,
	ExhibitPairLabel,
	ExhibitGroupRow,
	LightboxOverlay,
	LightboxImage,
	LightboxHint,
} from './components';

// `**bold**` and `*italic*` are the only markup the content file uses, so they are the only markup
// this reads — a full markdown parser would be answering a question nobody is asking here. Tried
// as a single pass rather than two, or a `**bold**` run would first get read as two `*italic*`
// markers either side of nothing. A fresh regex per call rather than a shared module-level one:
// a `g`-flagged regex carries `lastIndex` as mutable state on itself, and this function has no
// business remembering anything between one block of text and the next.
function renderInline(text) {
	const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g;
	// `nodes.length` is a unique, always-current key at the moment of each push — one less counter
	// to keep in step by hand.
	const nodes = [];
	let lastIndex = 0;
	let match;

	while ((match = pattern.exec(text))) {
		if (match.index > lastIndex) {
			nodes.push(<Fragment key={nodes.length}>{text.slice(lastIndex, match.index)}</Fragment>);
		}

		nodes.push(
			match[1] !== undefined ? <strong key={nodes.length}>{match[1]}</strong> : <em key={nodes.length}>{match[2]}</em>,
		);
		lastIndex = pattern.lastIndex;
	}

	if (lastIndex < text.length) {
		nodes.push(<Fragment key={nodes.length}>{text.slice(lastIndex)}</Fragment>);
	}

	return nodes;
}

function RuleBlock({ block }) {
	if (block.p) {
		return <p>{renderInline(block.p)}</p>;
	}

	if (block.list) {
		return (
			<RuleList>
				{block.list.map((item, index) => (
					<li key={index}>{renderInline(item)}</li>
				))}
			</RuleList>
		);
	}

	if (block.note) {
		return (
			<RuleNote>
				{block.buff && <BuffBadge>CEO Buff</BuffBadge>}
				{renderInline(block.note)}
			</RuleNote>
		);
	}

	return null;
}

// The photograph, mounted like a print clipped into the file — see the component file for why it
// is built this way rather than a plain <img>. `index` decides which side it floats to (and which
// way it leans), so consecutive pages alternate rather than the text always reading past it the
// same side twenty times running.
function Exhibit({ image, index, onZoom }) {
	const reverse = index % 2 === 1;

	return (
		<ExhibitFrame $reverse={reverse}>
			<ExhibitTape $side="left" />
			<ExhibitTape $side="right" />
			<ExhibitImage src={`img/rules/${image.file}`} alt={image.alt} onClick={() => onZoom(image)} />
			<ExhibitTag>
				<ExhibitLabel>Fig. {index + 1}</ExhibitLabel>
				<ExhibitCaption>{image.caption}</ExhibitCaption>
			</ExhibitTag>
		</ExhibitFrame>
	);
}

// Two tightly-cropped plays in one mat — a piece's move and its kill, read side by side rather
// than the single full-board print the narrative pages use. Cropped tight on purpose: an HQ, a
// header, or a hexagon that isn't part of the play would only be noise next to a picture this
// small.
function ExhibitPair({ images, index, onZoom, full }) {
	const reverse = index % 2 === 1;

	return (
		<ExhibitPairFrame $reverse={reverse} $count={images.length} $full={full}>
			<ExhibitTape $side="left" />
			<ExhibitTape $side="right" />
			<ExhibitPairRow $count={images.length} $full={full}>
				{images.map(image => (
					<ExhibitPairColumn key={image.file}>
						<ExhibitPairLabel>{image.label}</ExhibitPairLabel>
						<ExhibitImage src={`img/rules/${image.file}`} alt={image.alt} onClick={() => onZoom(image)} />
					</ExhibitPairColumn>
				))}
			</ExhibitPairRow>
			<ExhibitTag>
				<ExhibitLabel>Fig. {index + 1}</ExhibitLabel>
				<ExhibitCaption>{images.map(image => image.caption).join(' · ')}</ExhibitCaption>
			</ExhibitTag>
		</ExhibitPairFrame>
	);
}

// Every exhibit is a crop, and a crop this small is exactly the thing worth seeing full size — a
// click opens it over everything else, Escape or a click anywhere outside the print closes it.
// `stopPropagation` on the image itself is what makes "click outside" mean outside: without it,
// the click that opens the lightbox would also be the click on the overlay that closes it, and
// clicking the print to look closer would immediately dismiss it.
function RuleLightbox({ image, onClose }) {
	useEffect(() => {
		function onKeyDown(event) {
			if (event.key === 'Escape') {
				onClose();
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [onClose]);

	return (
		<LightboxOverlay id="rules-lightbox" onClick={onClose}>
			<LightboxImage src={`img/rules/${image.file}`} alt={image.alt} onClick={event => event.stopPropagation()} />
			<LightboxHint>Esc or click outside to close</LightboxHint>
		</LightboxOverlay>
	);
}

// The table of contents. Grouped rather than one long list of twenty, because a stranger to the
// game should be able to tell at a glance which door leads to what they actually want to know.
export function RulesIndex({ onOpen, onBack }) {
	return (
		<RulesPanel>
			<Buttons>
				<Button id="rules-main-menu" small active onClick={onBack}>
					Main Menu
				</Button>
			</Buttons>

			<Subtitle>How to Play</Subtitle>
			<RulesIntro>
				Everybody moves everybody's pieces. Only two cards, held in secret, say whose side you are really on. Here is
				the whole game, in plain words — pick a page, or read it start to finish.
			</RulesIntro>

			<CheatSheetLink id="rules-open-cheat-sheet" type="button" onClick={() => onOpen('cheat-sheet')}>
				<CheatSheetLinkTitle>Cheat Sheet</CheatSheetLinkTitle>
				<CheatSheetLinkTeaser>Every rule, one screen, no scrolling</CheatSheetLinkTeaser>
			</CheatSheetLink>

			{GROUPS.map(group => (
				<Fragment key={group}>
					<GroupHeading>{group}</GroupHeading>
					<RuleCardList>
						{RULES_PAGES.filter(page => page.group === group).map(page => (
							<RuleCard id={`rules-open-${page.slug}`} key={page.slug} type="button" onClick={() => onOpen(page.slug)}>
								<RuleCardTitle>{page.title}</RuleCardTitle>
								<RuleCardTeaser>{page.teaser}</RuleCardTeaser>
							</RuleCard>
						))}
					</RuleCardList>
				</Fragment>
			))}
		</RulesPanel>
	);
}

// Leaving the book, which is a different kind of decision from turning a page in it — so it keeps
// its own row, at the top, and is not repeated at the foot.
function PageChrome({ onBack, onIndex }) {
	return (
		<Buttons>
			<Button id="rules-main-menu" small active onClick={onBack}>
				Main Menu
			</Button>
			<Button id="rules-index" small active onClick={onIndex}>
				Index
			</Button>
		</Buttons>
	);
}

// The pager brackets the content rather than sitting only under it. A rule page is a long read on a
// phone: arriving at one, the way on was a scroll away at the bottom, and skipping a page you did
// not want meant scrolling the whole of it to find out there was a way past.
//
// At the top it is a glyph either side of the title — a running head — because that is a whole band
// of chrome saved on the screen where it is scarcest, and the two destinations are named in full at
// the foot of the page anyway. They are still named here, to the label rather than to the eye.
//
// `top`/`bottom` are in the ids because these are two real sets of buttons, not one drawn twice:
// duplicate ids would be invalid, and a strict-mode locator resolves to neither.
function RunningHead({ title, prev, next, onOpen }) {
	return (
		<PageHead>
			<HeadStep>
				{prev && (
					<Button
						id="rules-prev-top"
						small
						active
						aria-label={`Back to ${prev.title}`}
						title={prev.title}
						onClick={() => onOpen(prev.slug)}
					>
						‹
					</Button>
				)}
			</HeadStep>

			<PageHeadTitle>{title}</PageHeadTitle>

			<HeadStep>
				{next && (
					<Button
						id="rules-next-top"
						small
						active
						aria-label={`On to ${next.title}`}
						title={next.title}
						onClick={() => onOpen(next.slug)}
					>
						›
					</Button>
				)}
			</HeadStep>
		</PageHead>
	);
}

// The foot of the page, where there is room to say where each one goes.
function PageSteps({ prev, next, onOpen }) {
	if (!prev && !next) {
		return null;
	}

	return (
		<Buttons>
			{prev && (
				<Button id="rules-prev-bottom" small active onClick={() => onOpen(prev.slug)}>
					‹ {prev.title}
				</Button>
			)}
			{next && (
				<Button id="rules-next-bottom" small active onClick={() => onOpen(next.slug)}>
					{next.title} ›
				</Button>
			)}
		</Buttons>
	);
}

// One topic, start to finish, with a way to step to the next one without going back through the
// index — a rulebook you can read straight through if that is the mood you are in.
export function RulePage({ slug, onOpen, onBack, onIndex }) {
	const page = findRulePage(slug);
	const [zoomed, setZoomed] = useState(null);

	if (!page) {
		return (
			<RulesPanel>
				<PageChrome onBack={onBack} onIndex={onIndex} />
				<Subtitle>That page isn't here</Subtitle>
			</RulesPanel>
		);
	}

	const pageIndex = RULES_PAGES.findIndex(candidate => candidate.slug === slug);
	const prev = RULES_PAGES[pageIndex - 1];
	const next = RULES_PAGES[pageIndex + 1];

	// The summary reads as a grid rather than a topic with a photograph — see the component file
	// for why it gets its own layout instead of an `image`/`body` pair with nothing in either.
	if (page.cheatSheet) {
		return (
			<RulesPanel>
				<PageChrome onBack={onBack} onIndex={onIndex} />

				<RunningHead title={page.title} prev={prev} next={next} onOpen={onOpen} />

				<CheatGrid>
					{page.cheatSheet.map(section => (
						<CheatSection key={section.heading}>
							<CheatHeading>{section.heading}</CheatHeading>
							{section.intro && <CheatIntro>{renderInline(section.intro)}</CheatIntro>}
							<CheatList>
								{section.points.map((point, index) => (
									<li key={index}>{renderInline(point)}</li>
								))}
							</CheatList>
						</CheatSection>
					))}
				</CheatGrid>

				<PageSteps prev={prev} next={next} onOpen={onOpen} />
			</RulesPanel>
		);
	}

	return (
		<RulesPanel>
			<PageChrome onBack={onBack} onIndex={onIndex} />

			<RunningHead title={page.title} prev={prev} next={next} onOpen={onOpen} />

			<RuleContent>
				{/* Most pages float their exhibit beside the prose. A page whose images are the whole
				    story (a five-beat sequence, a full board) reads better as a strip after the words
				    instead, full width rather than squeezed into a float's column. */}
				{!page.imagesAtEnd && page.images && <ExhibitPair images={page.images} index={pageIndex} onZoom={setZoomed} />}
				{!page.imagesAtEnd && page.image && <Exhibit image={page.image} index={pageIndex} onZoom={setZoomed} />}
				<RuleBody>
					{page.body.map((block, index) => (
						<RuleBlock key={index} block={block} />
					))}
					{page.table && (
						<RuleTable>
							<thead>
								<tr>
									{page.table.headers.map((header, index) => (
										<th key={index}>{header}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{page.table.rows.map((row, rowIndex) => (
									<tr key={rowIndex}>
										{row.map((cell, cellIndex) => (
											<td key={cellIndex}>{renderInline(cell)}</td>
										))}
									</tr>
								))}
							</tbody>
						</RuleTable>
					)}
				</RuleBody>
				{page.imagesAtEnd && page.images && (
					<ExhibitPair images={page.images} index={pageIndex} onZoom={setZoomed} full />
				)}
				{page.imagesAtEnd && page.imageGroups && (
					<ExhibitGroupRow>
						{page.imageGroups.map((group, groupIndex) => (
							<ExhibitPair key={group[0].file} images={group} index={pageIndex + groupIndex} onZoom={setZoomed} full />
						))}
					</ExhibitGroupRow>
				)}
				{page.imagesAtEnd && page.image && <Exhibit image={page.image} index={pageIndex} onZoom={setZoomed} />}
			</RuleContent>

			<PageSteps prev={prev} next={next} onOpen={onOpen} />

			{zoomed && <RuleLightbox image={zoomed} onClose={() => setZoomed(null)} />}
		</RulesPanel>
	);
}

export default RulesIndex;
