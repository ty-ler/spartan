import { DialogRef } from '@angular/cdk/dialog';
import { Signal } from '@angular/core';
import { BrnDialogState } from './brn-dialog-state';
import { cssClassesToArray } from './brn-dialog.service';

export class BrnDialogRef {
	private _previousTimeout: ReturnType<typeof setTimeout> | undefined;

	public get open() {
		return this.state() === 'open' ? true : false;
	}

	constructor(
		private readonly _cdkDialogRef: DialogRef,
		public readonly state: Signal<BrnDialogState>,
		public readonly dialogId: number,
	) {}

	public close(result: any, delay: number = 0) {
		if (!this.open) return;

		if (this._previousTimeout) {
			clearTimeout(this._previousTimeout);
		}

		this._previousTimeout = setTimeout(() => {
			this._cdkDialogRef.close(result);
		}, delay);
	}

	public setPanelClass(paneClass: string | null | undefined) {
		this._cdkDialogRef.config.panelClass = cssClassesToArray(paneClass);
	}

	public setOverlayClass(overlayClass: string | null | undefined) {
		this._cdkDialogRef.config.backdropClass = cssClassesToArray(overlayClass);
	}

	public setAriaDescribedBy(ariaDescribedBy: string | null | undefined) {
		this._cdkDialogRef.config.ariaDescribedBy = ariaDescribedBy;
	}

	public setAriaLabelledBy(ariaLabelledBy: string | null | undefined) {
		this._cdkDialogRef.config.ariaLabelledBy = ariaLabelledBy;
	}

	public setAriaLabel(ariaLabel: string | null | undefined) {
		this._cdkDialogRef.config.ariaLabel = ariaLabel;
	}
}
