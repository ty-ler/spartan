import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { lucideX } from '@ng-icons/lucide';
import { hlm, injectExposesStateProvider } from '@spartan-ng/ui-core';
import { BrnDialogCloseDirective, BrnDialogRef, injectDialogContext } from '@spartan-ng/ui-dialog-brain';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { ClassValue } from 'clsx';
import { HlmDialogCloseDirective } from './hlm-dialog-close.directive';

@Component({
	selector: 'hlm-dialog-content',
	standalone: true,
	imports: [NgComponentOutlet, BrnDialogCloseDirective, HlmDialogCloseDirective, HlmIconComponent],
	providers: [provideIcons({ lucideX })],
	host: {
		'[class]': '_computedClass()',
		'[attr.data-state]': 'state()',
	},
	template: `
		@if (content) {
			<ng-container [ngComponentOutlet]="content"></ng-container>
		} @else {
			<ng-content />
		}

		<button brnDialogClose hlm>
			<span class="sr-only">Close</span>
			<hlm-icon class="flex h-4 w-4" size="100%" name="lucideX" />
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class HlmDialogContentComponent {
	private readonly _statusProvider = injectExposesStateProvider({ host: true, optional: true });

	private readonly _dialogRef = inject(BrnDialogRef);
	private readonly _dialogContext = injectDialogContext({ optional: true });

	public readonly state = computed(() => this._statusProvider?.state() ?? this._dialogRef?.state() ?? 'closed');

	public readonly content = this._dialogContext?.['$content'];

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm(
			'border-border grid w-full max-w-lg relative gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%]  data-[state=open]:slide-in-from-top-[2%] sm:rounded-lg md:w-full',
			this._userClass(),
		),
	);
}
