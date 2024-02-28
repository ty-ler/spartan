import { Dialog, DIALOG_SCROLL_STRATEGY_PROVIDER } from '@angular/cdk/dialog';
import { ComponentType, OverlayPositionBuilder, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {
	computed,
	effect,
	EffectRef,
	inject,
	Injectable,
	Renderer2,
	signal,
	StaticProvider,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { BrnDialogOptions } from './brn-dialog-options';
import { BrnDialogRef } from './brn-dialog-ref';
import { BrnDialogState } from './brn-dialog-state';

let dialogSequence = 0;

export const cssClassesToArray = (classes: string | string[] | undefined | null, defaultClass = ''): string[] => {
	if (typeof classes === 'string') {
		const splitClasses = classes.trim().split(' ');
		if (splitClasses.length === 0) {
			return [defaultClass];
		}
		return splitClasses;
	}
	return classes ?? [];
};

export const provideBrnDialog = () => [Dialog, BrnDialogService, DIALOG_SCROLL_STRATEGY_PROVIDER];

@Injectable()
export class BrnDialogService {
	private readonly _cdkDialog = inject(Dialog);
	private readonly _renderer = inject(Renderer2);
	private readonly _positionBuilder = inject(OverlayPositionBuilder);
	private readonly _sso = inject(ScrollStrategyOptions);

	public open<DialogContext>(
		content: ComponentType<unknown> | TemplateRef<unknown>,
		vcr?: ViewContainerRef,
		context?: DialogContext,
		options?: Partial<BrnDialogOptions>,
	) {
		if (options?.id && this._cdkDialog.getDialogById(options.id)) {
			return;
		}

		const positionStrategy =
			options?.positionStrategy ??
			(options?.attachTo && options?.attachPositions && options?.attachPositions?.length > 0
				? this._positionBuilder?.flexibleConnectedTo(options.attachTo).withPositions(options.attachPositions ?? [])
				: this._positionBuilder.global().centerHorizontally().centerVertically());

		let brnDialogRef!: BrnDialogRef;
		let effectRef!: EffectRef;

		const contextOrData = { ...context, close: () => brnDialogRef.close(options?.closeDelay) };

		const destroyed$ = new Subject<void>();
		const open = signal<boolean>(true);
		const state = computed<BrnDialogState>(() => (open() ? 'open' : 'closed'));
		const dialogId = dialogSequence++;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const cdkDialogRef = this._cdkDialog.open(content, {
			id: options?.id ?? `brn-dialog-${dialogId}`,
			role: options?.role,
			viewContainerRef: vcr,
			templateContext: () => ({
				$implicit: contextOrData,
			}),
			data: contextOrData,
			hasBackdrop: options?.hasBackdrop,
			panelClass: cssClassesToArray(options?.panelClass),
			backdropClass: cssClassesToArray(options?.backdropClass, 'bg-transparent'),
			positionStrategy,
			scrollStrategy: options?.scrollStrategy ?? this._sso?.block(),
			restoreFocus: options?.restoreFocus,
			disableClose: true,
			autoFocus: options?.autoFocus ?? 'first-tabbable',
			ariaDescribedBy: options?.ariaDescribedBy ?? `brn-dialog-description-${dialogId}`,
			ariaLabelledBy: options?.ariaLabelledBy ?? `brn-dialog-title-${dialogId}`,
			ariaLabel: options?.ariaLabel,
			ariaModal: options?.ariaModal,
			providers: (cdkDialogRef) => {
				const overlay = cdkDialogRef.overlayRef.overlayElement;
				const backdrop = cdkDialogRef.overlayRef.backdropElement;

				brnDialogRef = new BrnDialogRef(cdkDialogRef, state, dialogId);

				effectRef = effect(() => {
					if (overlay) {
						this._renderer.setAttribute(overlay, 'data-state', state());
					}
					if (backdrop) {
						this._renderer.setAttribute(backdrop, 'data-state', state());
					}
				});

				let providers: StaticProvider[] = [
					{
						provide: BrnDialogRef,
						useValue: brnDialogRef,
					},
				];

				if (options?.providers) {
					if (typeof options.providers === 'function') {
						providers.push(...options.providers());
					}

					if (Array.isArray(options.providers)) {
						providers.push(...options.providers);
					}
				}

				return providers;
			},
		});

		if (options?.closeOnOutsidePointerEvents) {
			cdkDialogRef.outsidePointerEvents.pipe(takeUntil(destroyed$)).subscribe(() => {
				brnDialogRef.close(options?.closeDelay);
			});
		}

		if (!options?.disableClose) {
			cdkDialogRef.keydownEvents
				.pipe(
					filter((e) => e.key === 'Escape'),
					takeUntil(destroyed$),
				)
				.subscribe(() => {
					brnDialogRef.close(options?.closeDelay);
				});
		}

		cdkDialogRef.closed.pipe(takeUntil(destroyed$)).subscribe(() => {
			open.set(false);
			destroyed$.next();
		});

		return cdkDialogRef;
	}
}
