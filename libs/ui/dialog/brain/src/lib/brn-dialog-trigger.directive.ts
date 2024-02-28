import { Directive, HostListener, inject, Input, Signal, signal } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';
import { BrnDialogState } from './brn-dialog-state';
import { BrnDialogComponent } from './brn-dialog.component';

let idSequence = 0;

@Directive({
	selector: 'button[brnDialogTrigger],button[brnDialogTriggerFor]',
	standalone: true,
	host: {
		'[id]': '_id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
	},
	exportAs: 'brnDialogTrigger',
})
export class BrnDialogTriggerDirective {
	protected _brnDialog = inject(BrnDialogComponent, { optional: true });
	protected readonly _brnDialogRef = inject(BrnDialogRef, { optional: true });

	protected readonly _id = signal(`brn-dialog-trigger-${idSequence++}`);

	public readonly state: Signal<BrnDialogState> = this._brnDialogRef?.state ?? signal('closed');
	public readonly dialogId = `brn-dialog-${this._brnDialogRef?.dialogId ?? idSequence++}`;

	@Input()
	set id(newId: string) {
		this._id.set(newId);
	}

	@Input()
	set brnDialogTriggerFor(brnDialog: BrnDialogComponent) {
		this._brnDialog = brnDialog;
	}

	@HostListener('click')
	open() {
		this._brnDialog?.open();
	}
}
