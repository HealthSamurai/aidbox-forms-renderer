import { styled } from "@linaria/react";
import type { TabContainerProps } from "@aidbox-forms/theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState } from "./empty-state.tsx";
import { clamp } from "./utils.ts";

export function TabContainer({
  header,
  items,
  value,
  onChange,
  errors,
  empty,
  linkId,
}: TabContainerProps) {
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const tabListInnerRef = useRef<HTMLDivElement | null>(null);
  const leftScrollRef = useRef<HTMLButtonElement | null>(null);
  const rightScrollRef = useRef<HTMLButtonElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const clampedIndex = clamp(value, 0, Math.max(items.length - 1, 0));

  const updateScrollState = useCallback(() => {
    const list = tabListRef.current;
    if (!list) return;
    const maxScrollLeft = Math.max(list.scrollWidth - list.clientWidth, 0);
    const nextScrollable = maxScrollLeft > 1;
    const nextCanScrollLeft = list.scrollLeft > 0;
    const nextCanScrollRight = list.scrollLeft < maxScrollLeft - 1;

    setIsScrollable((prev) =>
      prev !== nextScrollable ? nextScrollable : prev,
    );
    setCanScrollLeft((prev) =>
      prev !== nextCanScrollLeft ? nextCanScrollLeft : prev,
    );
    setCanScrollRight((prev) =>
      prev !== nextCanScrollRight ? nextCanScrollRight : prev,
    );
  }, []);

  useEffect(() => {
    const list = tabListRef.current;
    if (!list) return;
    updateScrollState();

    const handleScroll = () => updateScrollState();
    list.addEventListener("scroll", handleScroll, { passive: true });

    if (typeof ResizeObserver === "undefined") {
      const handleResize = () => updateScrollState();
      window.addEventListener("resize", handleResize);
      return () => {
        list.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }

    const observer = new ResizeObserver(() => updateScrollState());
    observer.observe(list);

    return () => {
      list.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [items.length, updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [items, updateScrollState]);

  useEffect(() => {
    const list = tabListRef.current;
    if (!list) return;
    const activeTab = list.querySelector<HTMLElement>('[data-selected="true"]');
    if (!activeTab) return;
    const inner = tabListInnerRef.current;
    if (!inner) return;

    const styles = window.getComputedStyle(inner);
    const leftPadding = Number.parseFloat(styles.paddingLeft) || 0;
    const rightPadding = Number.parseFloat(styles.paddingRight) || 0;
    const leftOverlay = leftScrollRef.current?.offsetWidth ?? 0;
    const rightOverlay = rightScrollRef.current?.offsetWidth ?? 0;
    const leftSafe = isScrollable ? Math.max(leftPadding, leftOverlay) : 0;
    const rightSafe = isScrollable ? Math.max(rightPadding, rightOverlay) : 0;
    const listRect = list.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const tabLeft = tabRect.left - listRect.left + list.scrollLeft;
    const tabRight = tabLeft + tabRect.width;
    const leftEdge = list.scrollLeft + leftSafe;
    const rightEdge = list.scrollLeft + list.clientWidth - rightSafe;

    let nextScrollLeft = list.scrollLeft;
    if (tabLeft < leftEdge) {
      nextScrollLeft = tabLeft - leftSafe;
    } else if (tabRight > rightEdge) {
      nextScrollLeft = tabRight - (list.clientWidth - rightSafe);
    }

    const maxScrollLeft = Math.max(list.scrollWidth - list.clientWidth, 0);
    const clampedNext = clamp(nextScrollLeft, 0, maxScrollLeft);
    if (clampedNext !== list.scrollLeft) {
      list.scrollTo({
        left: clampedNext,
        behavior: "smooth",
      });
    }
  }, [clampedIndex, isScrollable, items.length]);

  const handleScrollButton = (direction: 1 | -1) => {
    const list = tabListRef.current;
    if (!list) return;
    const offset = Math.max(140, Math.round(list.clientWidth * 0.6));
    list.scrollBy({ left: direction * offset, behavior: "smooth" });
  };

  if (items.length === 0) {
    return <EmptyState>{empty ?? "No tab content available."}</EmptyState>;
  }

  const active = items[clampedIndex];

  return (
    <Shell data-linkid={linkId}>
      {Boolean(header) && <Header>{header}</Header>}
      <TabStrip>
        <TabScrollButton
          ref={leftScrollRef}
          type="button"
          aria-label="Scroll tabs left"
          onClick={() => handleScrollButton(-1)}
          data-direction="left"
          data-visible={isScrollable && canScrollLeft ? "true" : "false"}
          disabled={!canScrollLeft}
        />
        <TabList role="tablist" ref={tabListRef}>
          <TabListInner
            ref={tabListInnerRef}
            data-scrollable={isScrollable ? "true" : "false"}
          >
            {items.map((item, idx) => {
              const selected = idx === clampedIndex;
              return (
                <TabButton
                  key={item.token}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={item.panelId}
                  id={item.buttonId}
                  onClick={() => onChange(idx)}
                  data-selected={selected ? "true" : "false"}
                >
                  {item.label}
                </TabButton>
              );
            })}
          </TabListInner>
        </TabList>
        <TabScrollButton
          ref={rightScrollRef}
          type="button"
          aria-label="Scroll tabs right"
          onClick={() => handleScrollButton(1)}
          data-direction="right"
          data-visible={isScrollable && canScrollRight ? "true" : "false"}
          disabled={!canScrollRight}
        />
      </TabStrip>
      <Panel
        role="tabpanel"
        id={active.panelId}
        aria-labelledby={active.buttonId}
      >
        {active.content}
      </Panel>
      {Boolean(errors) && <ErrorsSlot>{errors}</ErrorsSlot>}
    </Shell>
  );
}

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Header = styled.div`
  font-weight: 700;
`;

const TabStrip = styled.div`
  position: relative;
`;

const TabList = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabListInner = styled.div`
  position: relative;
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 0.25rem;
  min-width: 100%;
  padding: 0 0.25rem;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: #cbd5e0;
    pointer-events: none;
    z-index: 1;
  }
`;

const TabButton = styled.button`
  flex: 0 0 auto;
  position: relative;
  z-index: 0;
  border: 1px solid transparent;
  border-bottom: 1px solid transparent;
  background: transparent;
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  color: #4a5568;
  white-space: nowrap;

  &:first-child {
    margin-left: 0.25rem;
  }

  &:hover {
    color: #2d3748;
    background: #f7fafc;
  }

  &[data-selected="true"] {
    background: #fff;
    border-color: #cbd5e0;
    border-bottom-color: #fff;
    color: #2d3748;
    z-index: 2;
  }

  &:focus-visible {
    outline: 2px solid #2b6cb0;
    outline-offset: 2px;
  }
`;

const TabScrollButton = styled.button`
  position: absolute;
  top: 0;
  bottom: 1px;
  width: 2rem;
  border: 0;
  background: transparent;
  color: #4a5568;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;

  &[data-direction="left"] {
    left: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1) 75%,
      rgba(255, 255, 255, 0)
    );
  }

  &[data-direction="right"] {
    right: 0;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1) 75%,
      rgba(255, 255, 255, 0)
    );
  }

  &[data-visible="false"] {
    opacity: 0;
    pointer-events: none;
  }

  &::before {
    content: "";
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
  }

  &[data-direction="left"]::before {
    transform: rotate(135deg);
  }

  &[data-direction="right"]::before {
    transform: rotate(-45deg);
  }

  &:hover {
    color: #2d3748;
  }

  &:focus-visible {
    outline: 2px solid #2b6cb0;
    outline-offset: -2px;
  }

  &:disabled {
    cursor: default;
  }
`;

const Panel = styled.div`
  border: 0;
  padding: 0;
`;

const ErrorsSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
