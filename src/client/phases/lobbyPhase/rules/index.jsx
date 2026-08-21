import { Fragment, useEffect, useState } from 'react';
import { Button, Buttons } from 'Client/components/button';
import { Subtitle } from 'Client/components/title';
import useT from 'Client/i18n';
import { useRulesPages, useRuleGroups } from './content';
import { EXERCISES } from '../training/exercises';
import {
	RulesPanel,
	RulesIntro,
	PageHead,
	PageHeadTitle,
	HeadStep,
	CheatSheetLink,
	CheatSheetLinkTitle,
	CheatSheetLinkTeaser,
	TrainingFile,
	TrainingArt,
	TrainingWords,
	TrainingEyebrow,
	TrainingTitle,
	TrainingTeaser,
	TrainingStamp,
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

function RuleBlock({ block, buffLabel }) {
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
				{block.buff && <BuffBadge>{buffLabel}</BuffBadge>}
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
function Exhibit({ image, index, onZoom, figure }) {
	const reverse = index % 2 === 1;

	return (
		<ExhibitFrame $reverse={reverse}>
			<ExhibitTape $side="left" />
			<ExhibitTape $side="right" />
			<ExhibitImage src={`img/rules/${image.file}`} alt={image.alt} onClick={() => onZoom(image)} />
			<ExhibitTag>
				<ExhibitLabel>{figure(index + 1)}</ExhibitLabel>
				<ExhibitCaption>{image.caption}</ExhibitCaption>
			</ExhibitTag>
		</ExhibitFrame>
	);
}

// Two tightly-cropped plays in one mat — a piece's move and its kill, read side by side rather
// than the single full-board print the narrative pages use. Cropped tight on purpose: an HQ, a
// header, or a hexagon that isn't part of the play would only be noise next to a picture this
// small.
function ExhibitPair({ images, index, onZoom, full, figure }) {
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
				<ExhibitLabel>{figure(index + 1)}</ExhibitLabel>
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
	const t = useT();

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
			<LightboxHint>{t('rules.lightboxHint')}</LightboxHint>
		</LightboxOverlay>
	);
}

// A pointy-top hexagon, the same shape the board is tiled with, as an SVG path.
function hex(x, y, width, height) {
	const half = width / 2;

	return `M${x + half} ${y} L${x + width} ${y + height / 4} L${x + width} ${y + (height * 3) / 4}
		L${x + half} ${y + height} L${x} ${y + (height * 3) / 4} L${x} ${y + height / 4} Z`;
}

// Three cells, a piece on the first, and a ring over the cell it is two moves from — a whole turn of
// this game in one small drawing, and the pulse is the same mark the exercises put over what to
// click next. Not a photograph: at 104px a crop of the real board is a smudge, and a smudge is a
// poor invitation.
function TrainingDiagram() {
	const CELLS = [0, 36, 72];

	return (
		<TrainingArt viewBox="0 0 104 46" aria-hidden="true">
			{CELLS.map(x => (
				<path key={x} d={hex(x, 4, 32, 38)} fill="none" stroke="var(--ha-ink)" strokeWidth="1.2" opacity="0.55" />
			))}

			<path d={hex(0, 4, 32, 38)} fill="var(--ha-ink)" opacity="0.85" />
			<path d="M18 23 L26 23 M23 20 L26 23 L23 26" stroke="var(--ha-panel)" strokeWidth="1.6" fill="none" />

			<path d="M34 12 Q54 -2 86 12" stroke="var(--ha-accent)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

			<circle className="seek" cx="88" cy="23" r="13" fill="none" stroke="var(--ha-accent)" strokeWidth="2" />
			<circle cx="88" cy="23" r="2" fill="var(--ha-accent)" />
		</TrainingArt>
	);
}

// The table of contents. Grouped rather than one long list of twenty, because a stranger to the
// game should be able to tell at a glance which door leads to what they actually want to know.
export function RulesIndex({ onOpen, onTrain, onBack }) {
	const t = useT();
	const pages = useRulesPages();
	const groups = useRuleGroups();

	return (
		<RulesPanel>
			<Buttons>
				<Button id="rules-main-menu" small active onClick={onBack}>
					{t('common.mainMenu')}
				</Button>
			</Buttons>

			<Subtitle>{t('rules.howToPlay')}</Subtitle>
			<RulesIntro>{t('rules.intro')}</RulesIntro>

			{/* Above the reading, because for most people it is the better door: eight short exercises
			    on the real board beat twenty pages, and the pages are still here for afterwards. */}
			<TrainingFile id="rules-open-training" type="button" onClick={onTrain}>
				{/* The same corners of tape the exhibits are mounted with, so the one door that leads
				    out of the book reads as something stuck into it rather than another card in it. */}
				<ExhibitTape $side="left" />
				<ExhibitTape $side="right" />
				<TrainingDiagram />
				<TrainingWords>
					{/* Counted rather than written down: the course grows and a card that still says
					    eight is a card nobody thought to look at. */}
					<TrainingEyebrow>{t('rules.exerciseCount', { count: EXERCISES.length })}</TrainingEyebrow>
					<TrainingTitle>{t('rules.learnByPlaying')}</TrainingTitle>
					<TrainingTeaser>{t('rules.learnTeaser')}</TrainingTeaser>
				</TrainingWords>
				{/* Two lines, broken where the stamp is narrowest — which is a different place in each
				    language, so both halves are their own key rather than one string split on a space. */}
				<TrainingStamp>
					{t('rules.trainingStampTop')}
					<br />
					{t('rules.trainingStampBottom')}
				</TrainingStamp>
			</TrainingFile>

			<CheatSheetLink id="rules-open-cheat-sheet" type="button" onClick={() => onOpen('cheat-sheet')}>
				<CheatSheetLinkTitle>{t('rules.cheatSheetTitle')}</CheatSheetLinkTitle>
				<CheatSheetLinkTeaser>{t('rules.cheatSheetTeaser')}</CheatSheetLinkTeaser>
			</CheatSheetLink>

			{groups.map(group => (
				<Fragment key={group}>
					<GroupHeading>{group}</GroupHeading>
					<RuleCardList>
						{pages
							.filter(page => page.group === group)
							.map(page => (
								<RuleCard
									id={`rules-open-${page.slug}`}
									key={page.slug}
									type="button"
									onClick={() => onOpen(page.slug)}
								>
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
	const t = useT();

	return (
		<Buttons>
			<Button id="rules-main-menu" small active onClick={onBack}>
				{t('common.mainMenu')}
			</Button>
			<Button id="rules-index" small active onClick={onIndex}>
				{t('common.index')}
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
	const t = useT();

	return (
		<PageHead>
			<HeadStep>
				{prev && (
					<Button
						id="rules-prev-top"
						small
						active
						aria-label={t('rules.backTo', { title: prev.title })}
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
						aria-label={t('rules.onTo', { title: next.title })}
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
	const t = useT();
	const pages = useRulesPages();
	const [zoomed, setZoomed] = useState(null);

	// One closure rather than `t` threaded into four components: the figure number is the only string
	// an exhibit says, and every one of them says it the same way.
	const figure = n => t('rules.figure', { n });
	const page = pages.find(candidate => candidate.slug === slug) || null;

	if (!page) {
		return (
			<RulesPanel>
				<PageChrome onBack={onBack} onIndex={onIndex} />
				<Subtitle>{t('rules.missingPage')}</Subtitle>
			</RulesPanel>
		);
	}

	const pageIndex = pages.findIndex(candidate => candidate.slug === slug);
	const prev = pages[pageIndex - 1];
	const next = pages[pageIndex + 1];

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
				{!page.imagesAtEnd && page.images && (
					<ExhibitPair images={page.images} index={pageIndex} onZoom={setZoomed} figure={figure} />
				)}
				{!page.imagesAtEnd && page.image && (
					<Exhibit image={page.image} index={pageIndex} onZoom={setZoomed} figure={figure} />
				)}
				<RuleBody>
					{page.body.map((block, index) => (
						<RuleBlock key={index} block={block} buffLabel={t('rules.ceoBuff')} />
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
					<ExhibitPair images={page.images} index={pageIndex} onZoom={setZoomed} full figure={figure} />
				)}
				{page.imagesAtEnd && page.imageGroups && (
					<ExhibitGroupRow>
						{page.imageGroups.map((group, groupIndex) => (
							<ExhibitPair
								key={group[0].file}
								images={group}
								index={pageIndex + groupIndex}
								onZoom={setZoomed}
								full
								figure={figure}
							/>
						))}
					</ExhibitGroupRow>
				)}
				{page.imagesAtEnd && page.image && (
					<Exhibit image={page.image} index={pageIndex} onZoom={setZoomed} figure={figure} />
				)}
			</RuleContent>

			<PageSteps prev={prev} next={next} onOpen={onOpen} />

			{zoomed && <RuleLightbox image={zoomed} onClose={() => setZoomed(null)} />}
		</RulesPanel>
	);
}

export default RulesIndex;
