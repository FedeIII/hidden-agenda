import styled from 'styled-components';

// The waiting room, which is the first place an online table sees the skin the server drew for it:
// the room frame carries it alongside the seat list, so by the time a code is on screen everyone
// looking at that code is looking at the same material.

export const LobbyContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	padding: 24px 16px;
`;

export const Panel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	max-width: 420px;
`;

export const RoomCode = styled.div`
	font-family: var(--ha-face-data);
	font-size: 42px;
	letter-spacing: 0.24em;
	padding-left: 0.24em;
	color: var(--ha-ink);
`;

export const ShareHint = styled.div`
	font-family: var(--ha-face-data);
	font-size: 12px;
	color: var(--ha-ink-dim);
	letter-spacing: var(--ha-track-label);
	word-break: break-all;
	text-align: center;
`;

export const SeatList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

export const SeatRow = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-family: var(--ha-face-data);
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	padding: 7px 10px;
	color: var(--ha-ink);
	background: var(--ha-panel);
	border: 1px solid var(--ha-panel-edge);
	border-radius: var(--ha-panel-radius);
	opacity: ${({ dim }) => (dim ? 0.55 : 1)};
`;

// The right-hand end of a seat row. It had one thing in it and now has two, and a third child on a
// `space-between` row would have spread the name, the rating and the tag evenly across it.
export const SeatMeta = styled.span`
	display: flex;
	gap: 8px;
	align-items: baseline;
	flex-shrink: 0;
`;

// A rating, wherever one is shown. Tabular figures because these sit in a column and a proportional
// `1` would make the column ragged.
export const Rating = styled.span`
	font-family: var(--ha-face-data);
	font-variant-numeric: tabular-nums;
	color: var(--ha-ink-faint);
`;

export const SeatTag = styled.span`
	font-size: 11px;
	color: var(--ha-ink-faint);
	text-transform: uppercase;
`;

export const Field = styled.input`
	font-family: var(--ha-face-data);
	font-size: 17px;
	padding: 8px 10px;
	width: 100%;
	box-sizing: border-box;
	text-align: center;
	background: var(--ha-field-bg);
	color: var(--ha-field-ink);
	border: var(--ha-field-edge);
	border-radius: var(--ha-panel-radius);
	text-transform: ${({ code }) => (code ? 'uppercase' : 'none')};
	letter-spacing: ${({ code }) => (code ? '0.3em' : 'var(--ha-track-label)')};

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`;

export const Row = styled.div`
	display: flex;
	gap: 8px;
	width: 100%;
`;

export const Notice = styled.div`
	font-family: var(--ha-face-data);
	font-size: 13px;
	padding: 6px 10px;
	letter-spacing: var(--ha-track-label);
	color: ${({ bad }) => (bad ? 'var(--ha-accent)' : 'var(--ha-ink-dim)')};
`;

// The finder. Rows are buttons rather than list items with a handler, so a room can be reached by
// keyboard and reads as the thing it is: the one control on this screen that takes you to a table
// somebody else opened.

export const Section = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
	padding-top: 6px;
	border-top: 1px solid var(--ha-rule);
`;

export const RoomList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 5px;
	/* Six rows and then it scrolls. The list is live — rooms fill up and start while it is on screen —
	   so it has to have an end, or the panels below it walk down the page as rooms appear. */
	max-height: 210px;
	overflow-y: auto;
`;

export const RoomRow = styled.button`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: 10px;
	width: 100%;
	text-align: left;
	font-family: var(--ha-face-data);
	font-size: 15px;
	letter-spacing: var(--ha-track-label);
	padding: 7px 10px;
	color: var(--ha-ink);
	background: var(--ha-panel);
	border: 1px solid ${({ joinable }) => (joinable ? 'var(--ha-panel-edge)' : 'var(--ha-rule)')};
	border-radius: var(--ha-panel-radius);
	cursor: ${({ joinable }) => (joinable ? 'pointer' : 'not-allowed')};
	opacity: ${({ joinable }) => (joinable ? 1 : 0.55)};

	&:hover {
		border-color: ${({ joinable }) => (joinable ? 'var(--ha-accent)' : 'var(--ha-rule)')};
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 1px;
	}
`;

// all-small-caps rather than text-transform, for the reason the claim message uses it: uppercasing
// is applied by innerText and not by textContent, so it changes what a spec reads back. A room name
// is data — it goes out over the wire and comes back in a search — and nothing should rewrite it.
export const RoomName = styled.span`
	font-variant-caps: all-small-caps;
	letter-spacing: 0.04em;
	overflow-wrap: anywhere;
`;

// The name of the room you are sitting in, over the code. Small caps rather than uppercase for the
// same reason the rows are: this string travels, and nothing on screen should rewrite it.
export const RoomTitle = styled.div`
	font-family: var(--ha-face-data);
	font-size: 22px;
	letter-spacing: 0.08em;
	font-variant-caps: all-small-caps;
	color: var(--ha-ink);
	text-align: center;
	overflow-wrap: anywhere;
`;

export const RoomMeta = styled.span`
	display: flex;
	gap: 8px;
	align-items: baseline;
	flex-shrink: 0;
	font-size: 11px;
	color: var(--ha-ink-faint);
	text-transform: uppercase;
`;

export const RoomState = styled.span`
	color: ${({ open }) => (open ? 'var(--ha-accent)' : 'var(--ha-ink-faint)')};
`;

export const Choices = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

// Same shape as the skin picker's options and for the same reason: a border of one width whatever the
// state, so choosing does not nudge its neighbour sideways. Colour carries the state; width never does.
export const Choice = styled.button`
	font-family: var(--ha-face);
	font-weight: var(--ha-weight);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	padding: 4px 12px;
	cursor: pointer;
	border-radius: var(--ha-control-radius);
	clip-path: var(--ha-control-clip);
	border: 1px solid ${({ current }) => (current ? 'var(--ha-accent)' : 'var(--ha-rule)')};
	background: ${({ current }) => (current ? 'var(--ha-accent)' : 'transparent')};
	color: ${({ current }) => (current ? 'var(--ha-ink-on-accent)' : 'var(--ha-ink-dim)')};

	&:hover {
		color: ${({ current }) => (current ? 'var(--ha-ink-on-accent)' : 'var(--ha-ink)')};
		border-color: var(--ha-accent);
	}

	&:focus-visible {
		outline: 2px solid var(--ha-accent);
		outline-offset: 2px;
	}
`;

export const Hint = styled.span`
	font-family: var(--ha-face-data);
	font-size: 11px;
	letter-spacing: var(--ha-track-label);
	text-transform: uppercase;
	color: var(--ha-ink-faint);
`;
