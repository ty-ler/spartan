import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable, TemplateRef } from '@angular/core';
import { BrnDialogOptions, BrnDialogService, cssClassesToArray } from '@spartan-ng/ui-dialog-brain';
import { HlmDialogContentComponent } from './hlm-dialog-content.component';

export type HlmDialogOptions<DialogContext = any> = BrnDialogOptions & {
	contentClass?: string;
	context?: DialogContext;
};

@Injectable({
	providedIn: 'root',
})
export class HlmDialogService {
	private readonly _brnDialogService = inject(BrnDialogService);

	public open(component: ComponentType<unknown> | TemplateRef<unknown>, options: Partial<HlmDialogOptions>) {
		options = {
			role: 'dialog',
			attachPositions: [],
			attachTo: null,
			autoFocus: 'first-tabbable',
			closeDelay: 100,
			closeOnBackdropClick: true,
			closeOnOutsidePointerEvents: false,
			hasBackdrop: true,
			panelClass: '',
			positionStrategy: null,
			restoreFocus: true,
			scrollStrategy: null,
			disableClose: false,
			ariaLabel: undefined,
			ariaModal: true,
			...options,
			backdropClass: cssClassesToArray(
				`bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${options.backdropClass ?? ''}`,
			),
			context: { ...options?.context, $component: component, $dynamicComponentClass: options?.contentClass },
		};

		return this._brnDialogService.open(HlmDialogContentComponent, undefined, options.context, options);
	}
}
