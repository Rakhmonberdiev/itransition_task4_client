import { Component, computed, effect, signal } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { DatePipe } from '@angular/common';
import { User } from '../../_models/user.model';
import { PaginatedResult } from '../../_models/pagination.model';

@Component({
  selector: 'app-home',
  imports: [DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly searchTerm = signal('');
  readonly debouncedSearch = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly users = signal<User[]>([]);
  readonly totalCount = signal(0);
  readonly refresh = signal(0);
  readonly selectedIds = signal<Set<string>>(new Set());
  constructor(private usersService: UserService) {
    effect((onCleanup) => {
      const term = this.searchTerm();
      const handle = setTimeout(() => this.debouncedSearch.set(term), 500);
      onCleanup(() => clearTimeout(handle));
    });

    effect((onCleanup) => {
      const query = {
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.debouncedSearch() || undefined,
      };
      this.refresh();
      const sub = this.usersService
        .getUsers(query)
        .subscribe((res: PaginatedResult<User>) => {
          this.users.set(res.items);
          this.totalCount.set(res.totalCount);
          this.selectedIds.set(new Set());
        });
      onCleanup(() => sub.unsubscribe());
    });
  }
  readonly totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize())
  );
  readonly allSelected = computed(() => {
    const list = this.users();
    return list.length > 0 && list.every((u) => this.selectedIds().has(u.id));
  });
  onSearchInput(value: string) {
    this.searchTerm.set(value);
    this.page.set(1);
  }
  onPrev() {
    if (this.page() > 1) this.page.update((n) => n - 1);
  }
  onNext() {
    if (this.page() < this.totalPages()) this.page.update((n) => n + 1);
  }
  onPageSelect(n: number) {
    this.page.set(n);
  }
  toggleOne(id: string, checked: boolean) {
    const s = new Set(this.selectedIds());
    checked ? s.add(id) : s.delete(id);
    this.selectedIds.set(s);
  }

  toggleAll(checked: boolean) {
    if (checked) {
      this.selectedIds.set(new Set(this.users().map((u) => u.id)));
    } else {
      this.selectedIds.set(new Set());
    }
  }
  blockSelected() {
    const ids = [...this.selectedIds()];
    if (!ids.length) return;

    this.usersService.blockUsers(ids).subscribe(() => this.reload());
  }

  unblockSelected() {
    const ids = [...this.selectedIds()];
    if (!ids.length) return;

    this.usersService.unblockUsers(ids).subscribe(() => this.reload());
  }
  deleteSelected() {
    const ids = [...this.selectedIds()];
    if (!ids.length) return;
    const currentCount = this.users().length;
    this.usersService.deleteUsers(ids).subscribe(() => {
      if (
        ids.length === currentCount &&
        this.page() > 1 &&
        this.searchTerm().length === 0
      ) {
        this.page.update((n) => n - 1);
      }
      this.reload();
    });
  }

  private reload() {
    this.selectedIds.set(new Set());
    this.refresh.update((n) => n + 1);
  }
}
