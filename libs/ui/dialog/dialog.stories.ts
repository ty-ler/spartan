import { Component, HostBinding, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconComponent } from '../icon/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '../table/helm/src';
import { BrnDialogImports, BrnDialogRef, injectDialogContext } from './brain/src';
import {
	HlmDialogComponent,
	HlmDialogDescriptionDirective,
	HlmDialogHeaderComponent,
	HlmDialogImports,
	HlmDialogService,
	HlmDialogTitleDirective,
} from './helm/src';

const meta: Meta<HlmDialogComponent> = {
	title: 'Dialog',
	component: HlmDialogComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [BrnDialogImports, HlmDialogImports, HlmLabelDirective, HlmButtonDirective, HlmInputDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmDialogComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <hlm-dialog>
    <button id='edit-profile' brnDialogTrigger hlmBtn>Edit Profile</button>
    <hlm-dialog-content class='sm:max-w-[425px]' *brnDialogContent='let ctx'>
         <hlm-dialog-header>
          <h3 hlmDialogTitle>Edit profile</h3>
          <p hlmDialogDescription>
            Make changes to your profile here. Click save when you're done.
          </p>
        </hlm-dialog-header>
        <div class='grid gap-4 py-4'>
          <div class='grid grid-cols-4 items-center gap-4'>
            <label hlmLabel for='name' class='text-right'>
              Name
            </label>
            <input hlmInput id='name' value='Pedro Duarte' class='col-span-3' />
          </div>
          <div class='grid grid-cols-4 items-center gap-4'>
            <label hlmLabel for='username' class='text-right'>
              Username
            </label>
            <input hlmInput id='username' value='@peduarte' class='col-span-3' />
          </div>
        </div>
        <hlm-dialog-footer>
          <button hlmBtn type='submit'>Save changes</button>
        </hlm-dialog-footer>
    </hlm-dialog-content>
    </hlm-dialog>
    `,
	}),
};

type ExampleUser = {
	name: string;
	email: string;
	phone: string;
};

@Component({
	selector: 'dialog-dynamic-component-story',
	standalone: true,
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn (click)="openDynamicComponent()">Select User</button>
	`,
})
class DialogDynamicComponentStory {
	private readonly _hlmDialogService = inject(HlmDialogService);

	private readonly _users: ExampleUser[] = [
		{
			name: 'Helena Chambers',
			email: 'helenachambers@chorizon.com',
			phone: '+1 (812) 588-3759',
		},
		{
			name: 'Josie Crane',
			email: 'josiecrane@hinway.com',
			phone: '+1 (884) 523-3324',
		},
		{
			name: 'Lou Hartman',
			email: 'louhartman@optyk.com',
			phone: '+1 (912) 479-3998',
		},
		{
			name: 'Lydia Zimmerman',
			email: 'lydiazimmerman@ultrasure.com',
			phone: '+1 (944) 511-2111',
		},
	];

	public openDynamicComponent() {
		const dialogRef = this._hlmDialogService.open(SelectUserComponent, {
			context: {
				users: this._users,
			},
			contentClass: 'sm:!max-w-[750px]',
		});

		dialogRef.closed$.subscribe((user) => {
			if (user) {
				console.log('Selected user:', user);
			}
		});
	}
}

@Component({
	selector: 'dynamic-content',
	standalone: true,
	imports: [
		HlmDialogHeaderComponent,
		HlmDialogTitleDirective,
		HlmDialogDescriptionDirective,
		HlmTableComponent,
		HlmThComponent,
		HlmTrowComponent,
		HlmTdComponent,
		HlmButtonDirective,
		HlmIconComponent,
	],
	providers: [provideIcons({ lucideCheck })],
	template: `
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Select user</h3>
			<p hlmDialogDescription>Click a row to select a user.</p>
		</hlm-dialog-header>

		<hlm-table>
			<hlm-trow>
				<hlm-th class="w-44">Name</hlm-th>
				<hlm-th class="w-60">Email</hlm-th>
				<hlm-th class="w-48">Phone</hlm-th>
			</hlm-trow>
			@for (user of users; track user.name) {
				<button class="text-left" (click)="selectUser(user)">
					<hlm-trow>
						<hlm-td truncate class="w-44 font-medium">{{ user.name }}</hlm-td>
						<hlm-td class="w-60">{{ user.email }}</hlm-td>
						<hlm-td class="w-48">{{ user.phone }}</hlm-td>
					</hlm-trow>
				</button>
			}
		</hlm-table>
	`,
})
class SelectUserComponent {
	@HostBinding('class') private readonly _class: string = 'flex flex-col gap-4';

	private readonly _dialogRef = inject<BrnDialogRef<ExampleUser>>(BrnDialogRef);
	private readonly _dialogContext = injectDialogContext<{ users: ExampleUser[] }>();

	protected readonly users = this._dialogContext.users;

	public selectUser(user: ExampleUser) {
		this._dialogRef.close(user);
	}
}

export const DynamicComponent: Story = {
	name: 'Dynamic Component',
	decorators: [
		moduleMetadata({
			imports: [DialogDynamicComponentStory],
		}),
	],
	render: () => ({
		template: `<dialog-dynamic-component-story />`,
	}),
};
